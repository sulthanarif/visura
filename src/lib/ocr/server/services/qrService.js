// src/lib/ocr/server/services/qrService.js
import fs from "fs";
import path from "path";
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';

export const qrService = {
 
  generateQRCode: async (url) => {
    try {
      if (!url || typeof url !== 'string' || url.trim() === '') {
        throw new Error('Valid URL string required');
      }
      return await QRCode.toDataURL(url);
    } catch (error) {
      console.error("Error generating QR Code:", error);
      throw error;
    }
  },

 
  embedQRCodeInPdf: async (pdfPath, qrCodeDataUrl, storageUrl) => {
    try {
      let pdfDoc;
      const pdfBytes = await fs.promises.readFile(pdfPath);
      
      try {
        pdfDoc = await PDFDocument.load(pdfBytes);
      } catch (err) {
        console.error("Error loading PDF (try with ignoreEncryption):", err.message);
        pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: false });
      }

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Load QR code image
      const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);

      // Define where to place the QR code (adjust as needed)
      const qrCodeWidth = 30;
      const qrCodeHeight = 30;
      const x = 62; // Adjust as needed
      const y = firstPage.getHeight() - qrCodeHeight - 22;

      // Draw QR Code
      firstPage.drawImage(qrCodeImage, {
        x,
        y,
        width: qrCodeWidth,
        height: qrCodeHeight,
      });

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      return modifiedPdfBytes;
    } catch (error) {
      console.error("Error embedding QR code:", error);
      throw error;
    }
  },


  processQRCodeEmbedding: async (pdfPath, storageUrl, tempDir, outputBaseName) => {
    const result = {
      modifiedPdf: null,
      isEncrypted: false
    };

    try {
      if (storageUrl && typeof storageUrl === 'string' && storageUrl.trim() !== '') {
        const qrCodeDataUrl = await qrService.generateQRCode(storageUrl);
        
        // Embed QR Code into PDF
        const modifiedPdfBytes = await qrService.embedQRCodeInPdf(pdfPath, qrCodeDataUrl, storageUrl);
        
        // Save the modified PDF
        const modifiedPdfPath = path.join(tempDir, `${outputBaseName}-modified.pdf`);
        fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);
        result.modifiedPdf = modifiedPdfPath;
      } else {
        console.warn("StorageUrl is not provided or invalid, skipping QR code generation");
        result.isEncrypted = false; // Set to false since it's not an encryption issue
      }
    } catch (err) {
      console.error("Error embedding QR Code into PDF", err);
      result.isEncrypted = true;
    }

    return result;
  }
};

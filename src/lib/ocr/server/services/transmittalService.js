// src/lib/ocr/server/services/transmittalService.js

export const transmittalService = {
 
  generateTransmittalContent: (transmittalData, projectName, documentName, transmittalNumber, isTemplate = false) => {
    try {
      const drawingDataRows = transmittalData.map((item, index) => {
        const drawingNumber = item.filename;
        const title = item.title || "";
        const drawingCode = item.drawingCode || "";
        const drawingRevision = item.revision;
        return `${index + 1},${drawingNumber},${title},${drawingCode},A2,${drawingRevision}`;
      }).join("\n");

      // Generate content based on isTemplate
      const csvContent = isTemplate
        ? transmittalService.generateTemplateContent(drawingDataRows, projectName, documentName, transmittalNumber)
        : drawingDataRows;

      return csvContent;
    } catch (error) {
      console.error("Error generating transmittal content:", error);
      throw error;
    }
  },


  generateTemplateContent: (drawingDataRows, projectName, documentName, transmittalNumber) => {
    const now = new Date();
    const D = now.getDate();
    const M = now.getMonth() + 1;
    const Y = now.getFullYear();
    
    return `TRANSMITTAL,,,,,,,,,,
,,,,,,,,,,
No. Transmittal: ${transmittalNumber},,,,,,,,,,
PROJECT: ,,,,,,,,,  Received :,${documentName}
${projectName},,,,,,,,,Date,${D}
,,,,,,,,,Month,${M}
PACKAGE :,,,,,,,,,Year,${Y}
,,,,,,,,,,
No.,File Name,Drawing Name,Drawing Code,Format,Revision
${drawingDataRows}
,,,,,,,,,,
Prepared by:,,,,,,,,,,Checked by:
,,,,,,,,,,
,,,,,,,,,,
Distributed to :,,,,,,,,,,Copies to :
,,,,,,,,,,
1,,,,,,,,,,
2,,,,,,,,,,
3,,,,,,,,,,
,,,,,,,,,,
Legends,,,,,,,,,,Reason for Issue
,A   ,:   Approval,,,,,I, : Information,,
,C   ,:   Copy,,,,,R, : Revision,,
,CO ,:   Construction,,,,,Ct, : Contract,,
,D    ,:   Disk,,,,,T, : Tender,,
Issued by: .....................,,,,,,,,,,`;
  },

 
  processFilename: (csvFileName, isTemplate = false) => {
    let finalCsvName = csvFileName.trim() || "allData";
    
    if (!isTemplate) {
      const baseName = finalCsvName.toLowerCase().endsWith('.csv')
        ? finalCsvName.slice(0, -4)
        : finalCsvName;
      if (!baseName.toLowerCase().endsWith('-raw')) {
        finalCsvName = baseName + "-raw";
      }
    }

    // Ensure .csv extension
    if (!finalCsvName.toLowerCase().endsWith(".csv")) {
      finalCsvName += ".csv";
    }
    
    // Sanitize filename
    finalCsvName = finalCsvName.replace(/[^a-zA-Z0-9-_.]/g, "_");
    
    return finalCsvName;
  },
 
  generateTransmittal: async (params) => {
    try {
      const {
        transmittalData,
        projectName,
        documentName,
        transmittalNumber,
        csvFileName,
        isTemplate = false
      } = params;

      if (!transmittalData || !projectName || !documentName || !transmittalNumber || !csvFileName) {
        throw new Error("Missing required fields for transmittal generation.");
      }

      // Process filename
      const finalCsvName = transmittalService.processFilename(csvFileName, isTemplate);

      // Generate CSV content
      const csvContent = transmittalService.generateTransmittalContent(
        transmittalData,
        projectName,
        documentName,
        transmittalNumber,
        isTemplate
      );

      return {
        message: "Transmittal generated successfully.",
        csvFileName: finalCsvName,
        csvContent: csvContent,
        isTemplate,
      };
    } catch (error) {
      console.error("Error generating transmittal:", error);
      throw error;
    }
  }
};

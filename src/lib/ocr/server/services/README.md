# OCR Processing Services Architecture

This document describes the separated OCR processing architecture that divides the upload, OCR, QR embed, and transmittal generation processes into separate service files.

## Service Structure

### 1. Upload Service (`uploadService.js`)
Handles file upload and validation functionality.

**Methods:**
- `handleFormData(req, res)` - Processes multipart form data and validates PDF files
- `cleanupFile(filePath)` - Cleans up individual uploaded files

**Features:**
- File type validation (PDF only)
- File size validation (10MB limit)
- Automatic directory creation
- Error handling with custom messages

### 2. Storage Service (`storageService.js`)
Manages file uploads to Supabase storage and database operations with storage optimization.

**Methods:**
- `uploadPdf(pdfPath, originalFilename)` - Uploads PDF files to storage
- `uploadModifiedPdf(pdfBuffer, originalFilename)` - Uploads QR-embedded PDFs
- `compressImage(imageBuffer, imagePath)` - Compresses images using Sharp with adaptive compression
- `uploadImages(imagePaths)` - Uploads processed images (original, cropped, parts only - excludes hi-dpi and rotated)
- `saveOcrResults(result, projectId, image_paths, pdf_url)` - Saves OCR results to database

**Features:**
- Automatic file sanitization
- Storage path organization by file type
- Image compression with adaptive quality levels
- Hi-DPI and rotated image exclusion for storage optimization
- Public URL generation
- Database integration
- Local file cleanup after upload

**Storage Optimization:**
- **Hi-DPI images**: Skipped and deleted locally (saves ~25-50% storage)
- **Rotated images**: Skipped and deleted locally (saves additional storage)
- **Image compression**: Adaptive compression based on image type:
  - Original: 75% quality
  - Cropped: 70% quality  
  - Parts: 85% quality (preserves OCR text clarity)
- **Automatic resizing**: Images > 1920px width are resized
- **Compression logging**: Tracks storage savings and compression ratios

### 3. QR Service (`qrService.js`)
Handles QR code generation and PDF embedding.

**Methods:**
- `generateQRCode(url)` - Creates QR code from URL
- `embedQRCodeInPdf(pdfPath, qrCodeDataUrl, storageUrl)` - Embeds QR code into PDF
- `processQRCodeEmbedding(pdfPath, storageUrl, tempDir, outputBaseName)` - Complete QR processing workflow

**Features:**
- QR code validation
- PDF encryption handling
- Configurable QR code positioning
- Error handling for encrypted PDFs

### 4. Transmittal Service (`transmittalService.js`)
Manages transmittal CSV generation with template and raw modes.

**Methods:**
- `generateTransmittalContent(transmittalData, projectName, documentName, transmittalNumber, isTemplate)` - Creates CSV content
- `generateTemplateContent(drawingDataRows, projectName, documentName, transmittalNumber)` - Creates template format
- `processFilename(csvFileName, isTemplate)` - Sanitizes and processes filenames
- `generateTransmittal(params)` - Generates CSV content for direct download (no local storage)

**Features:**
- Template and raw mode support
- Automatic filename sanitization
- Date formatting
- CSV structure generation
- Direct download without server storage
- Memory-efficient streaming

### 5. Cleanup Service (`cleanupService.js`)
Handles cleanup of temporary files and project data.

**Methods:**
- `cleanupLocalProcessedFiles(pdfPath, result)` - Cleans up files after failed processing
- `cleanupLocalFile(filePath)` - Removes individual local files
- `cleanupProject(projectId)` - Complete project cleanup (database + storage)
- `cleanupAfterProcessing(pdfPath, result)` - Post-processing cleanup

**Features:**
- Comprehensive file cleanup
- Database cleanup integration
- Storage cleanup
- Error-safe operations

## Main Controller (`ocrController.js`)

The main controller orchestrates all services:

```javascript
const ocrController = {
  handleFormData: uploadService.handleFormData,
  processUpload: async (req, res) => {
    // 1. Handle file upload
    // 2. Upload PDF to storage
    // 3. Process with OCR
    // 4. Generate and embed QR code
    // 5. Upload processed images
    // 6. Save results to database
    // 7. Cleanup temporary files
  },
  generateTransmittal: async (req, res) => {
    // Uses transmittalService.generateTransmittal
  },
  cleanup: async (req, res) => {
    // Uses cleanupService.cleanupProject
  }
};
```

## Processing Flow

1. **Upload Phase** - `uploadService.handleFormData()`
   - Validates PDF files
   - Creates temporary storage
   - Returns file objects

2. **Storage Phase** - `storageService.uploadPdf()`
   - Uploads original PDF
   - Gets public URL for QR code

3. **OCR Phase** - `processPDF()` (in ocr-process.js)
   - Converts PDF to images
   - Processes with Tesseract
   - Extracts text data

4. **QR Phase** - `qrService.processQRCodeEmbedding()`
   - Generates QR code from storage URL
   - Embeds QR into PDF
   - Creates modified PDF

5. **Final Storage Phase** - `storageService.uploadModifiedPdf()` & `uploadImages()`
   - Uploads QR-embedded PDF
   - Uploads all processed images
   - Saves OCR results to database

6. **Cleanup Phase** - `cleanupService.cleanupAfterProcessing()`
   - Removes temporary files
   - Cleans up local storage

## Benefits of Separation

1. **Maintainability** - Each service has a single responsibility
2. **Testability** - Services can be tested independently
3. **Reusability** - Services can be reused in different contexts
4. **Scalability** - Individual services can be optimized separately
5. **Error Handling** - Isolated error handling per service
6. **Code Organization** - Clear separation of concerns

## Usage Example

```javascript
import { 
  uploadService, 
  storageService, 
  qrService, 
  transmittalService, 
  cleanupService 
} from "../services";

// Upload and process files
const { pdfFiles } = await uploadService.handleFormData(req, res);
const pdfUrl = await storageService.uploadPdf(pdfPath, filename);
const qrResult = await qrService.processQRCodeEmbedding(pdfPath, pdfUrl, tempDir, baseName);
const imagePaths = await storageService.uploadImages(images);

// Generate transmittal
const transmittal = await transmittalService.generateTransmittal({
  transmittalData,
  projectName,
  documentName,
  transmittalNumber,
  csvFileName,
  isTemplate: false
});

// Cleanup
await cleanupService.cleanupProject(projectId);
```

This architecture provides a clean, maintainable, and scalable solution for OCR processing workflows.

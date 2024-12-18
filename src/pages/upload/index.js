// src/pages/upload/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
    const [uploadStatus, setUploadStatus] = useState('');
    const [results, setResults] = useState(null);
    const [csvFileName, setCsvFileName] = useState(null);
    const [cleanupStatus, setCleanupStatus] = useState('');
     const [isUploading, setIsUploading] = useState(false);
      const router = useRouter(); // Inisialisasi router

    const handleFileSubmit = async (event) => {
        event.preventDefault();
        setResults(null);
        setCsvFileName(null);
        setCleanupStatus('');
        setUploadStatus('Preparing Upload...');
         setIsUploading(true);

        const formData = new FormData(event.target);
     try{
          const response = await fetch('/api/ocr', {
                method: 'POST',
                body: formData,
            });
           if (!response.ok) {
               const errorData = await response.json();
               throw new Error(`Upload failed: ${errorData.message}`);
           }

            setUploadStatus('Scanning...');
            const data = await response.json();
            setResults(data.data);
            setCsvFileName(data.csvFileName);
            setUploadStatus('Upload and scanning successful.');
      }
      catch(error){
            console.error('Error during upload or processing:', error);
           setUploadStatus(`Upload failed: ${error.message || 'An unexpected error occurred'}`);
      }
      finally{
           setIsUploading(false);
      }

    };

     const handleDownloadCSV = async () => {
        const link = document.createElement('a');
        link.href = `/output/${csvFileName}`;
        link.download = csvFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Panggil backend untuk membersihkan direktori
        try{
            setCleanupStatus('Cleaning up files, please wait...');
           const response = await fetch('/api/cleanup', { method: 'POST' });

              if (!response.ok) {
                    throw new Error('Failed to clean up files');
              }

              setCleanupStatus('Cleanup completed, refreshing...');
             router.reload(); // Refresh halaman
         }
          catch(error){
              console.error("Error during cleanup: ", error);
              setCleanupStatus(`Failed to clean up files ${error.message || ''}`);
          }
    };


    return (
        <div>
            <h1>OCR PDF</h1>
            <form onSubmit={handleFileSubmit}>
                <input type="file" name="pdfFile" multiple accept=".pdf" required />
                <button type="submit" disabled={isUploading}>
                    {isUploading ? 'Processing...' : 'Process PDF'}
                </button>
            </form>
             {uploadStatus && <p>{uploadStatus}</p>}
               {cleanupStatus && <p>{cleanupStatus}</p>}

            {results && (
                <div>
                    <h2>Results</h2>
                    {results.map((result, index) => (
                        <div key={index}>
                            <p><strong>Filename:</strong> {result.filename}</p>
                            <p><strong>Title:</strong> {result.title}</p>
                            <p><strong>Revision:</strong> {result.revision}</p>
                            <p><strong>Drawing Code:</strong> {result.drawingCode}</p>
                            <p><strong>Date:</strong> {result.date}</p>
                            <hr />
                        </div>
                    ))}
                    {csvFileName && (
                        <button onClick={handleDownloadCSV}>Download CSV</button>
                    )}
                </div>
            )}
        </div>
    );
}
// src/pages/upload/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function UploadPage() {
    const [uploadStatus, setUploadStatus] = useState('');
    const [results, setResults] = useState(null);
    const [csvFileName, setCsvFileName] = useState(null);
    const [cleanupStatus, setCleanupStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isScanning, setIsScaning] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]); // State untuk menyimpan file yang dipilih
    const router = useRouter(); // Inisialisasi router

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files); // Update state dengan file yang dipilih
    };

    const handleFileSubmit = async (event) => {
        event.preventDefault();
        setResults(null);
        setCsvFileName(null);
        setCleanupStatus('');
        setUploadStatus('Uploading to Server...');
        setIsUploading(true);

        const formData = new FormData(event.target);
        try {
            const response = await fetch('/api/ocr', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Upload failed: ${errorData.message}`);
            }

            setUploadStatus('Scanning...');
            setIsScaning(true);
            const data = await response.json();
            setResults(data.data);
            setCsvFileName(data.csvFileName);
            setUploadStatus('Upload and scanning successful.');
        } catch (error) {
            console.error('Error during upload or processing:', error);
            setUploadStatus(`Upload failed: ${error.message || 'An unexpected error occurred'}`);
        } finally {
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
        try {
            setCleanupStatus('Cleaning up files, please wait...');
            const response = await fetch('/api/cleanup', { method: 'POST' });

            if (!response.ok) {
                throw new Error('Failed to clean up files');
            }

            setCleanupStatus('Cleanup completed, refreshing...');
            router.reload(); // Refresh halaman
        } catch (error) {
            console.error("Error during cleanup: ", error);
            setCleanupStatus(`Failed to clean up files ${error.message || ''}`);
        }
    };

    return (
        <div>
            <h1>OCR PDF</h1>
            <form onSubmit={handleFileSubmit}>
                <input
                    type="file"
                    name="pdfFile"
                    multiple
                    accept=".pdf"
                    required
                    onChange={handleFileChange} // Tambahkan handler untuk perubahan file
                />
                <button type="submit" disabled={isUploading}>
                    {isUploading ? 'Processing...' : 'Process PDF'}
                </button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
            {cleanupStatus && <p>{cleanupStatus}</p>}

            {/* Tampilkan daftar file yang dipilih */}
            {selectedFiles.length > 0 && (
                <div>
                    <h2>Selected Files</h2>
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {results && (
                <div>
                    <h2>Results</h2>
                    {results.map((result, index) => (
                        <div key={index}>
                            <p><strong>Filename:</strong> {result.filename}</p>
                            <p><strong>Title:</strong> {result.title}</p>
                            <p><strong> Revision:</strong> {result.revision}</p>
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
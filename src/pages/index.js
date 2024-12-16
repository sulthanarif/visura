import { useState } from 'react';

export default function HomePage() {
    const [uploadStatus, setUploadStatus] = useState('');
    const [results, setResults] = useState(null);
    const [csvFileName, setCsvFileName] = useState(null); // State untuk nama file CSV

    const handleFileSubmit = (event) => {
      event.preventDefault();
      setUploadStatus('Uploading...');
      setResults(null);
      setCsvFileName(null);
    
      const formData = new FormData(event.target);
    
      const fetchPromise = fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });
    
      setUploadStatus('Scanning...');
    
      fetchPromise
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            setResults(data.data);
            setCsvFileName(data.csvFileName);
            setUploadStatus('Upload successful.');
          } else {
            const errorData = await response.json();
            setUploadStatus(`Upload failed: ${errorData.message}`);
          }
        })
        .catch((error) => {
          console.error('Error during the upload:', error);
          setUploadStatus('Upload failed: An unexpected error occurred.');
        });
    };
    
    const handleDownloadCSV = () => {
      // membuat link download pada browser
      const link = document.createElement('a');
          link.href = `/src/output/${csvFileName}`;
          link.download = csvFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
    };

    return (
        <div>
            <h1>OCR PDF</h1>
            <form onSubmit={handleFileSubmit}>
                <input type="file" name="pdfFile" multiple accept=".pdf" required />
                <button type="submit">Process PDF</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
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
                     {/* Tampilkan tombol download CSV jika csvFileName ada */}
                      {csvFileName && (
                         <button onClick={handleDownloadCSV}>Download CSV</button>
                      )}
                </div>
            )}
        </div>
    );
}
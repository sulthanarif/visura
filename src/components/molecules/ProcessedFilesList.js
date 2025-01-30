import React, { useEffect, useState } from 'react';
import supabase from '@/utils/supabaseClient';

const ProcessedFilesList = ({ projectId }) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('ocr_results')
      .select('*')
      .eq('projectId', projectId);
      
    if (!error) setFiles(data);
  };

  const handleDelete = async (id, imagePaths) => {
    // Hapus dari database
    await supabase.from('ocr_results').delete().eq('id', id);
    
    // Hapus gambar dari storage
    await supabase.storage.from('ocr-storage').remove(imagePaths);
    
    fetchFiles();
  };

  const handleView = (imagePath) => {
    const { data: { publicUrl } } = supabase.storage
      .from('ocr-storage')
      .getPublicUrl(imagePath);
    window.open(publicUrl, '_blank');
  };

  useEffect(() => { fetchFiles() }, [projectId]);

  return (
    <div className="processed-files">
      {files.map(file => (
        <div key={file.id} className="file-item">
          <span>{file.filename}</span>
          <div className="actions">
            <button onClick={() => handleView(file.image_paths.parts[0])}>
              View
            </button>
            <button onClick={() => handleDelete(file.id, Object.values(file.image_paths).flat())}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessedFilesList;
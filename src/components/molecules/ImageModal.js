import React from 'react';
import { toast } from 'react-hot-toast';
import Icon from '../atoms/Icon';

const ImageModal = ({ 
  isOpen, 
  onClose, 
  images,
  resultId,
  onDelete
}) => {
  if (!isOpen) return null;

  const handleDelete = async (imagePath) => {
    try {
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imagePath, 
          resultId 
        }),
      });

      if (!response.ok) throw new Error('Gagal menghapus gambar');
      
      onDelete(imagePath);
      toast.success('Gambar berhasil dihapus');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Preview Gambar</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Icon name="times" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img.url}
                alt={`Hasil proses ${idx + 1}`}
                className="w-full h-auto rounded-lg border"
              />
              <button
                onClick={() => handleDelete(img.path)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="trash" className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
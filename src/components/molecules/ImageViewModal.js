import React from 'react';

const ImageViewModal = ({ imageUrl, onClose }) => (
  <div className="image-modal">
    <div className="modal-content">
      <img src={imageUrl} alt="Processed Part" />
      <button onClick={onClose}>Tutup</button>
    </div>
  </div>
);

export default ImageViewModal;
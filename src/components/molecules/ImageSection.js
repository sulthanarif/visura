const ImageSection = ({ title, images, showIndex }) => {
    if (!images.length) return null;
    
    return (
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src={src}
                alt={`${title} ${showIndex ? index : ''}`}
                className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center text-sm">
                {showIndex ? `Part ${index}` : title}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default ImageSection;
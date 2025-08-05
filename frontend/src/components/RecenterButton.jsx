import { useMap } from 'react-leaflet';
import { useState } from 'react';

export default function RecenterButton({ position }) {
  const map = useMap();
  const [isRecenting, setIsRecenting] = useState(false);

  const handleClick = () => {
    setIsRecenting(true);
    map.setView(position, 13);
    setTimeout(() => setIsRecenting(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isRecenting}
      className="group bg-white hover:bg-blue-50 disabled:bg-gray-100 border-2 border-blue-200 hover:border-blue-400 disabled:border-gray-200 text-blue-700 hover:text-blue-800 disabled:text-gray-400 font-semibold px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed backdrop-blur-sm"
    >
      {isRecenting ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-sm">Centering...</span>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-lg mr-2 group-hover:animate-pulse">📍</span>
          <span className="text-sm font-medium">My Location</span>
        </div>
      )
      }
    </button>
    )
}
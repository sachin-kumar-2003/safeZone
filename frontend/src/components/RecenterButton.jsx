import { useMap } from 'react-leaflet';

export default function RecenterButton({ position }) {
  const map = useMap();

  const handleClick = () => {
    map.setView(position, 13); 
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'white',
        border: '1px solid #ccc',
        padding: '8px',
        borderRadius: '4px',
      }}
    >
      📍 Go to My Location
    </button>
  );
}

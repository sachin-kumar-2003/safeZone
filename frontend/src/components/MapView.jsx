import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import api from '../service/api';
import 'leaflet/dist/leaflet.css';

export default function MapView() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await api.get('/alerts');
      setAlerts(res.data);
    };
    fetchAlerts();
  }, []);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[28.6139, 77.2090]} // Delhi coords example
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {alerts.map((alert) => (
          <Marker
            key={alert._id}
            position={[
              alert.location.coordinates[1],
              alert.location.coordinates[0],
            ]}
          >
            <Popup>
              <strong>{alert.alertType}</strong><br />
              {alert.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

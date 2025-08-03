import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import api from '../service/api';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from '../context/AuthContext';

export default function MapView() {
  const [alerts, setAlerts] = useState([]);
  const { user } = useContext(AuthContext);
  // useEffect(() => {
  //   if(user){
  //     const fetchAlerts = async () => {
  //       const res = await api.get('/alert');
  //       setAlerts(res.data);
  //     };
  //     fetchAlerts();
  //   }
  // }, [user]);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[28.6139, 77.2090]} 
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {alerts &&  alerts.map((alert) => (
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

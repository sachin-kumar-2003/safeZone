import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useContext, useEffect, useState } from 'react';
import socket from '../service/socket';
import api from '../service/api';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from '../context/AuthContext';
import RecenterButton from './RecenterButton';

export default function MapView() {
  const [alerts, setAlerts] = useState([]);
  const { user } = useContext(AuthContext);

  const [position, setPosition] = useState([28.6139, 77.2090]); 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    socket.on('new alert', (alert) => {
      setAlerts((prev) => [...prev, alert]);
    });
    return () => socket.off('new alert');
  }, []);

  useEffect(() => {
    if (user) {
      const fetchAlerts = async () => {
        try {
          const res = await api.get('/alert');
          setAlerts(res.data.alerts);
        } catch (err) {
          console.error('Error fetching alerts:', err);
        }
      };
      fetchAlerts();
    }
  }, [user]);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position}>
          <Popup>
            <strong>You are here</strong>
          </Popup>
        </Marker>

        {alerts &&
          alerts.map((alert) => (
            <Marker
              key={alert._id}
              position={[
                alert.location.coordinates[1], 
                alert.location.coordinates[0], 
              ]}
            >
              <Popup>
                <strong>{alert.alertType}</strong>
                <br />
                {alert.description}
              </Popup>
            </Marker>
          ))}
          <RecenterButton position={position} />
      </MapContainer>
    </div>
  );
}

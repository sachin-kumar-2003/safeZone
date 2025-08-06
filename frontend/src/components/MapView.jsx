import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useContext, useEffect, useState } from 'react';
import socket from '../service/socket';
import api from '../service/api';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from '../context/AuthContext';
import RecenterButton from './RecenterButton';
import {toast} from 'react-toastify';

export default function MapView() {

  const [alerts, setAlerts] = useState([]);
  const { user } = useContext(AuthContext);

  const [position, setPosition] = useState([30.3165, 78.0322]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);


  useEffect(() => {
    socket.on('new alert', (alert) => {
      console.log('New alert received:', alert);
      setAlerts((prev) => [...prev, alert]);
    });
    return () => socket.off('new alert');
  }, []);

  useEffect(() => {
    if (user) {
      const fetchAlerts = async () => {
        try {
          const res = await api.get('/alert/all');
          setAlerts(res.data.alerts);
          console.log('Fetched alerts:', res.data.alerts);
          toast.success('Alerts fetched successfully!');
        } catch (err) {
          console.error('Error fetching alerts:', err);
          toast.error(err.response?.data?.message || 'Error fetching alerts');
        }
      };
      fetchAlerts();
    }
  }, []);

return (
  <div className="relative w-full h-screen bg-gradient-to-b mt-0 from-blue-100 to-gray-100 -z-0 ">
    <div className="absolute inset-4 rounded-2xl shadow-2xl overflow-hidden border-[6px] border-blue-400">
      <MapContainer
        center={position}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <span className="text-blue-700 font-semibold">📍 You are here</span>
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
                <span className="text-red-700 font-bold">🚨 {alert.alertType}</span>
                <br />
                <span className="text-sm">{alert.description}</span>
              </Popup>
            </Marker>
          ))}

        <div className="absolute top-6 right-6 z-[1000]">
          <RecenterButton position={position} />
        </div>
      </MapContainer>
    </div>
  </div>
);

}

import { useState } from 'react';
import api from '../service/api';

export default function CreateAlertForm() {
  const [alertType, setAlertType] = useState('');
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState([77.2090, 28.6139]);

  const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(coordinates);
        try {
        await api.post('/alert/create', {
            alertType,
            description,
            cordinates: coordinates
        });
        alert('Alert created!');
        } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Error');
        }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Create Alert</h2>
      <input
        type="text"
        placeholder="Alert Type"
        value={alertType}
        onChange={(e) => setAlertType(e.target.value)}
        className="border p-2 w-full"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full"
      />
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Longitude"
          value={coordinates[0]}
          onChange={(e) =>
            setCoordinates([parseFloat(e.target.value), coordinates[1]])
          }
          className="border p-2 w-1/2"
        />
        <input
          type="number"
          placeholder="Latitude"
          value={coordinates[1]}
          onChange={(e) =>
            setCoordinates([coordinates[0], parseFloat(e.target.value)])
          }
          className="border p-2 w-1/2"
        />
      </div>
      <button type="submit" className="bg-red-600 text-white px-4 py-2">
        Submit Alert
      </button>
    </form>
  );
}

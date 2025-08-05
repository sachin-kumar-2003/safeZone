import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Allalerts from './Allalerts';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  if (!profileData) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  const handleShowAlerts = () => {
    navigate('/alerts'); 
  };

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md border">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Profile</h2>

      <div className="space-y-2 text-gray-700">
        <p>
          <strong className="text-gray-900">Username:</strong> {profileData.username}
        </p>
        <p>
          <strong className="text-gray-900">Email:</strong> {profileData.email}
        </p>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleShowAlerts}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          My Alerts
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../service/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Allalerts(){
    const { user } = useContext(AuthContext);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
  const fetchAlerts = async () => {
    try {
      const response = await api.get('/alert/user', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
    setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts');
    }
    setLoading(false);
  };
  
  if (user?.token) {
    fetchAlerts();
  }
}, [user]);


    return (
        <div className="text-center mt-10 text-gray-500">
            <h2 className="text-2xl font-semibold mb-4">All Alerts</h2>
            {loading ? (
                <div className="flex justify-center items-center">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.364A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.574z"></path>
                    </svg>
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.length > 0 ? (
                        alerts.map(alert => (
                            <div key={alert._id} className="p-4 bg-white shadow rounded border">
                                <h3 className="font-bold">{alert.title}</h3>
                                <p>{alert.description}</p>
                                <p className="text-sm text-gray-500">Posted by: {alert.user.username}</p>
                            </div>
                        ))
                    ) : (
                        <p>No alerts found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
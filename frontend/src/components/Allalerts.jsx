import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../service/api';
import { toast } from 'react-toastify';

export default function Allalerts() {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ id: '', alertType: '', description: '' });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete the alert")) return;
    try {
      await api.delete(`/alert/delete/${id}`, {
        headers: { Authorization: `${user.token}` },
      });
      setAlerts(prev => prev.filter(alert => alert._id !== id));
      toast.success("Alert deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete alert");
    }
  };

  const handleEdit = (alert) => {
    setEditData({
      id: alert._id,
      alertType: alert.alertType,
      description: alert.description,
    });
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/alert/update/${editData.id}`,
        {
          alertType: editData.alertType,
          description: editData.description,
        },
        {
          headers: { Authorization: `${user.token}` },
        }
      );

      setAlerts(prev =>
        prev.map(alert =>
          alert._id === editData.id ? { ...alert, ...editData } : alert
        )
      );
      toast.success("Alert updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error while editing:", error);
      toast.error("Failed to update alert");
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/alert/user', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.token) fetchAlerts();
  }, [user]);

  return (
    <div className="text-center mt-10 text-gray-500">
      <h2 className="text-2xl font-semibold mb-4">All Alerts</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <div key={alert._id} className="p-5 bg-white shadow-md rounded-lg border border-gray-200 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{alert.alertType}</h3>
                <p className="text-gray-700 mb-2">{alert.description}</p>
                <p className="text-sm text-gray-500 mb-4">Posted by: {alert.userId.username}</p>
                <div className='flex w-full justify-center'>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDelete(alert._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(alert)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No alerts found.</p>
          )}
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Edit Alert</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-left text-sm text-gray-600">Alert Type</label>
                <input
                  type="text"
                  value={editData.alertType}
                  onChange={e => setEditData({ ...editData, alertType: e.target.value })}
                  className="w-full px-3 py-2 border rounded outline-none focus:ring-2 ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-left text-sm text-gray-600">Description</label>
                <textarea
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded outline-none focus:ring-2 ring-blue-400"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

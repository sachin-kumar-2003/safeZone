import { useEffect, useContext ,useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import MapView from './components/MapView';
import Profile from './components/Profile';
import Allalerts from './components/Allalerts';
import CreateAlertForm from './components/CreateAlertForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io("http://localhost:3000");

export default function App() {
  const { user  } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  useEffect(() => {
    if( user ){
      socket.emit("registerSocket", user._id);
    }

    socket.on('new alert', (alert) => {
      console.log('New alert posted:', alert);
      toast.success("new alert posted");
    });
    if( ! user ){
      return () =>{
        socket.disconnect();
      }
    }

  }, [user]);
  
  const { logout } = useContext(AuthContext);
  return (
  <Router>
    <nav className="flex items-center justify-between p-4 bg-gray-100 shadow">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold text-blue-700">Map</Link>
        {user && (
          <Link to="/create" className="text-blue-600 hover:underline">Create Alert</Link>
        )}
      </div>

      <div className="flex items-center space-x-4 ">
        {user ? (
          <div className="relative group">
            <button className="flex items-center space-x-2 text-blue-700 focus:outline-none " onClick={() => setShowProfile(!showProfile)}>
              <span>{user.username || "Profile"}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showProfile && <div className="z-30 absolute right-0 hidden mt-0 w-40 bg-white border rounded shadow-md group-hover:block">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>}
          </div>
        ) : (
          <>
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </>
        )}
      </div>
    </nav>

    <Routes>
      <Route path="/" element={<MapView />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<CreateAlertForm />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/alerts" element={<Allalerts />} />
    </Routes>

    <ToastContainer />
  </Router>
);

}
export { socket };
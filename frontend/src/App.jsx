import { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import MapView from './components/MapView';
import CreateAlertForm from './components/CreateAlertForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io("http://localhost:3000");

export default function App() {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if( user ){
      socket.emit("registerSocket", user._id);
    }

    socket.on("newNearbyAlert", (alert) =>{
      console.log("New alert received:", alert.description);
    })

    socket.on('newAlert', (alert) => {
      console.log('New alert posted:', alert);
    });

    return () =>{
      socket.disconnect();
    }

  }, [user]);
  
  const { logout } = useContext(AuthContext);
  return (
    <Router>
      <nav className="flex space-x-4 p-4 bg-gray-200">
        <Link to="/" className="text-blue-600">Map</Link>
        {user ? (
          <>
            <Link to="/create" className="text-blue-600">Create Alert</Link>
            <button onClick={logout} className="text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" className="text-blue-600">Register</Link>
            <Link to="/login" className="text-blue-600">Login</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateAlertForm />} />
      </Routes>

      <ToastContainer />
    </Router>
   
  );
}
export { socket };
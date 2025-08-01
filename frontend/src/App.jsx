import { useEffect , useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import io from "socket.io-client"

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
  
  return (
    <div>
      <h1>SafeZone App</h1>
      {user ? <p>Welcome, {user.name}</p> : <p>Please log in.</p>}
    </div>
  );


}
export { socket };
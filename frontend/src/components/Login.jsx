import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../service/api";

export default function Login() {
    const [ form , setForm ] = useState({
        email: "",
        password: ""
    });
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", form);
            if(res.data){
                login(res.data);
                alert("login successfull");
            }
        } catch ( error ){
            console.error("Login error:", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    }
      return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={form.email}
        className="border p-2 w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        value={form.password}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2">
        Login
      </button>
    </form>
  );
    
}
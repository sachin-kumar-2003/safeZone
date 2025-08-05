import { useState,useContext } from "react";
import api from "../service/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";


export default function Register(){
    const [form , setForm] = useState({
        username: "",
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
            const res = await api.post("/auth/register", form);
            if(res.data){
                login(res.data);
                // alert("Registration successful!");
                toast.success("Registration successful!");
                window.location.href = "/login";

            }
        } catch (error) {
            console.error("Registration error:", error);
            // alert("Registration failed. Please try again.");
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };



    return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Register</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        value={form.username}
        className="border p-2 w-full"
      />
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
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">
        Register
      </button>
    </form>
  );
}
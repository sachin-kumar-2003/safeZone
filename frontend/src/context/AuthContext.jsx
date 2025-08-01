import { useState , useEffect , createContext, Children } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ( { children }) =>{
    const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
});


const login = (userData) =>{
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
};

const logout = () =>{
    setUser(null);
    localStorage.removeItem('user');
};

return (
    <AuthContext.Provider value={{ user, login, logout}}>
        {children}
    </AuthContext.Provider>

)
};
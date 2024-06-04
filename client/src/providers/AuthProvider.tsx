import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import useLocalstorage from "../hooks/useLocalstorage";
import { useNavigate } from "react-router-dom";
import userApi from "../api/user.api";

interface AuthContextType {
    user: any;
    logout: () => void;
    setUser: (user: any) => void
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children : ReactNode}) => {
    const [user, setUser] = useState(null);

    const logout = async () => {
        const response = await fetch('/auth/signout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if(response.ok) {
            setUser(null); 
        }
    }
     return (
            <AuthContext.Provider value={{user, logout, setUser}}>
                {children}
            </AuthContext.Provider>
     )
}
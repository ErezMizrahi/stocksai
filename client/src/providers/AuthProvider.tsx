import { ReactNode, createContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import useLocalstorage from "../hooks/useLocalstorage";
import { useNavigate } from "react-router-dom";
import userApi from "../api/user.api";
import { client } from "../utils/client";

interface AuthContextType {
    user: any;
    token: string | null;
    setUser: (user: any) => void
    setAccessToken: (user: any) => void
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children : ReactNode}) => {
    const [user, setUser] = useState(null);
    const { setItem, getItem } = useLocalstorage();
    const [token, setToken] = useState<string | null>(getItem());

    const setAccessToken = (accessToken: string | null) => {
        setItem(accessToken);
        setToken(accessToken);
    }

    useLayoutEffect(() => {
        const authInterceptor = client.interceptors.request.use((config) => {
            config.headers.Authorization = token ? `Bearer ${token.replace(/\"/g, "")}` : config.headers.Authorization;
            return config;
        });

        return () => client.interceptors.request.eject(authInterceptor);
    }, [token])

     return (
            <AuthContext.Provider value={{user, token, setUser, setAccessToken}}>
                {children}
            </AuthContext.Provider>
     )
}
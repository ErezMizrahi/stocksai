import { PropsWithChildren, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useLocalstorage from '../hooks/useLocalstorage';


type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: { children : JSX.Element}):  JSX.Element | null {
  const { user } = useAuth();

  if(!user){
    return <Navigate to="/login" />
  }

  return children;
}
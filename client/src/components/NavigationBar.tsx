import React, { useMemo } from 'react'
import Logo from './Logo'
import { useAuth } from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../utils/routes';
import { convertToCamalCase } from '../utils/camalCase';
import { LogoutButton } from './styled/Buttons.styled';
import { NavBar, NavigationList } from './styled/Navigation.styled';

const NavigationBar = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const menuLinks = useMemo(() => {
      return routes
        .filter(route => route.children)
        .map(route => {
          return route.children!.filter(route => !route.dontInclude).map(route => {
            return {
              name: convertToCamalCase(route.path.slice(1, route.path.length)),
              path: route.path
            }
          })
        })
        .flat()
    }, [])
    
    const handlelogout = async () => {
      auth.setAccessToken(null);
      auth.setUser(null);
      navigate('/login', { replace: true });
    }


  return (
    <NavBar>
        <Logo />
        <div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
          <NavigationList>
              { auth.user && 
                menuLinks.map(route => (
                  <Link key={route.path} to={route.path}> {route.name} </Link>
                ))}
              
          </NavigationList>
          <LogoutButton onClick={ handlelogout }>Logout</LogoutButton> 
        </div>
    </NavBar>
  )
}

export default NavigationBar
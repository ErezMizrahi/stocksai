import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NavigationBar from './NavigationBar'
import { GridPadding, Grid } from './styled/Containers.styled'
import { useAuth } from '../hooks/useAuth'
import { useQuery, useQueryClient } from 'react-query'
import userApi from '../api/user.api'
import { queryKeys } from '../utils/queryKeys'

const Layout = () => {
  const { setUser, token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading } = useQuery({
    queryKey: [queryKeys.whoami, token],
    queryFn: async () => {
      const response = await userApi.whoami();

      if(response.success) {
          const userInfo = await response.success;
          setUser(userInfo);
          return userInfo
      } 
    },
    enabled: token != undefined && token != null,
    cacheTime: 0,
    staleTime: 0,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.myStocksData])
    },
    onError: (e: any) => {
      if(e.status === 401 || e.response.status === 401) {
        navigate('/login', { replace: true });
      }
    }
    })

  if(isLoading){
    return <div>
      Loading...
    </div>
  }
  return (
    <>
      <Grid>
        <NavigationBar />
          <GridPadding>
            <Outlet />
          </GridPadding>
      </Grid>
    </>
    
  )
}

export default Layout
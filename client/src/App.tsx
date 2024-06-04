import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { routes } from './utils/routes';
import { useQuery, useQueryClient } from 'react-query';
import { useAuth } from './hooks/useAuth';
import { queryKeys } from './utils/queryKeys';

const router = createBrowserRouter(routes);

function App() {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: [queryKeys.whoami],
    queryFn: async () => {
      const response = await fetch('/auth/whoami', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
      });

      if(response.ok) {
          const userInfo = await response.json();
          setUser(userInfo);
          return userInfo
      } 
  },
  onSuccess: () => {
    queryClient.invalidateQueries([queryKeys.myStocksData])
  }
  })

  if(isLoading){
    return <div>
      Loading...
    </div>
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App;

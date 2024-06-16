import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { routes } from './utils/routes';
import { useQuery, useQueryClient } from 'react-query';
import { useAuth } from './hooks/useAuth';
import { queryKeys } from './utils/queryKeys';
import userApi from './api/user.api';
import { useNavigate } from "react-router-dom";

const router = createBrowserRouter(routes);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

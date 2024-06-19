import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Stock from "../pages/Stock";


export const routes = [
    {
      element: <Layout />,
      namespace: 'protected',
      children: [
        {
          path: '/dashboard',
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: '/stock',
          dontInclude: true,
          element: (
            <ProtectedRoute>
              <Stock />
            </ProtectedRoute>
          ),
        },
      ]
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
  ];
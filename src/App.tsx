import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { DashboardPage } from './pages/dashboard';
import AppLayout from './components/layouts/AppLayout';
import InventoryPage from './pages/invatory';
import { ProductsPage } from './pages/products';
import { useContext, useEffect } from 'react';
import { AppContext } from './contexts/app';
import { useApp } from './contexts/keepsomewhere';

function App() {

  const { darkMode } = useApp();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <DashboardPage />
        },
        {
          path: "/products",
          element: <ProductsPage />
        },
        {
          path: "/inventory",
          element: <InventoryPage />
        }
      ]
    }

  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>

  )
}
export default App;

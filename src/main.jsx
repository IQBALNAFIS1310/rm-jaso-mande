import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import ProtectedRoute from './security/ProtectedRoute.jsx'

import Dashboard from './pages/Dashboard.jsx'
import Landing from './pages/Landing.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Kasir from './pages/Kasir.jsx'
import DashboardFounder from './pages/DashboardFounder.jsx'
import DashboardManager from './pages/DashboardManager.jsx'


// Definisi routing
const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "founder",
        element: (
          <ProtectedRoute allowedRoles={["founder"]}>
            <DashboardFounder />
          </ProtectedRoute>
        ),
      },
      {
        path: "manager",
        element: (
          <ProtectedRoute allowedRoles={["manager"]}>
            <DashboardManager />
          </ProtectedRoute>
        ),
      },
      {
        path: "cashier",
        element: (
          <ProtectedRoute allowedRoles={["cashier"]}>
            <Kasir />
          </ProtectedRoute>
        ),
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

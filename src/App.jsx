import { Outlet, useNavigate } from "react-router-dom";
import { createContext, useState } from "react";
import { useAuth } from "./hooks/useAuth";

export const CartContext = createContext();

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]); // state untuk keranjang

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <div className="flex min-h-screen flex-col">
        <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
          <h1 className="text-xl font-bold">Selamat datang, {user?.name}</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </CartContext.Provider>
  );
}

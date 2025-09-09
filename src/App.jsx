import { Outlet } from "react-router-dom";
import {createContext } from "react";

export const CartContext = createContext();

export default function App() {
  return (
    <CartContext.Provider>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header />

        {/* Konten halaman (akan berubah sesuai route) */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </CartContext.Provider>
  );
}

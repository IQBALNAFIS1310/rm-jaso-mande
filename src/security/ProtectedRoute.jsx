import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // tunggu sampai user dari cookie selesai load
  if (user === undefined) return null; // bisa ganti spinner juga

  // jika belum login
  if (!user) return <Navigate to="/login" replace />;

  // jika role tidak diizinkan
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

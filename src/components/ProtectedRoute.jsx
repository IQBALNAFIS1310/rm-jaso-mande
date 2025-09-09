import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // const apiKey = localStorage.getItem("informasiakun");
  // if (!apiKey) {
  //   return <Navigate to="/" replace />;
  // }
  return children;
}

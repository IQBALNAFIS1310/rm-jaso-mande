import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { Home } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const password = form.password.trim();

    if (!name || !password) {
      setError("Nama dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, role, password")
        .eq("name", name)
        .single();

      if (error || !data) throw new Error("Nama atau password salah");

      const user = data;

      if (user.password !== password) throw new Error("Nama atau password salah");

      login({ id: user.id, role: user.role, name });

      switch (user.role) {
        case "cashier":
          navigate("/app/cashier");
          break;
        case "manager":
          navigate("/app/manager");
          break;
        case "founder":
          navigate("/app/founder");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Masuk
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 transition-colors"
            }`}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home size={16} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

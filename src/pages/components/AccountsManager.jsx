import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function AccountsManager() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("*");
    if (!error) setAccounts(data || []);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await supabase.from("accounts").update({ status: newStatus }).eq("id", id);
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: newStatus } : a
      )
    );
  };

  const deleteAccount = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akun ini?")) return;
    await supabase.from("accounts").delete().eq("id", id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Kelola Akun</h2>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border p-3">ID</th>
              <th className="border p-3">Nama</th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="border p-3">{a.id}</td>
                <td className="border p-3 font-medium">{a.name}</td>
                <td className="border p-3 capitalize">{a.role}</td>
                <td className="border p-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${a.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {a.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="border p-3">
                  <button
                    className={`px-3 py-1 rounded text-white text-sm font-semibold transition ${a.status === "active"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                      }`}
                    onClick={() => toggleStatus(a.id, a.status)}
                  >
                    {a.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button
                    className="px-3 py-1 rounded text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition"
                    onClick={() => deleteAccount(a.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                  Belum ada akun terdaftar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden grid gap-4">
        {accounts.length === 0 && (
          <p className="text-gray-500 italic text-center">Belum ada akun terdaftar</p>
        )}
        {accounts.map((a) => (
          <div
            key={a.id}
            className="bg-white p-4 rounded-lg shadow border flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <h3 className="font-bold text-lg">{a.name}</h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${a.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {a.status === "active" ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">ID:</span> {a.id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Role:</span> {a.role}
            </p>
            <button
              className={`mt-2 px-3 py-2 rounded text-white text-sm font-semibold transition ${a.status === "active"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
                }`}
              onClick={() => toggleStatus(a.id, a.status)}
            >
              {a.status === "active" ? "Nonaktifkan" : "Aktifkan"}
            </button>
            <button
              className="flex-1 px-3 py-2 rounded text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition"
              onClick={() => deleteAccount(a.id)}
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

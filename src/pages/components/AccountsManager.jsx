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
    setAccounts(accounts.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Kelola Akun</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(a => (
            <tr key={a.id}>
              <td className="border p-2">{a.id}</td>
              <td className="border p-2">{a.name}</td>
              <td className="border p-2">{a.role}</td>
              <td className="border p-2">{a.status}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => toggleStatus(a.id, a.status)}
                >
                  {a.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

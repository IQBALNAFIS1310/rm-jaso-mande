// src/components/ActivityLog.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*, accounts(name, role)")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Activity Logs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>Tidak ada aktivitas</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Akun</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Aksi</th>
              <th className="border p-2">Detail</th>
              <th className="border p-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="border p-2">{log.id}</td>
                <td className="border p-2">{log.accounts?.name || "Unknown"}</td>
                <td className="border p-2">{log.accounts?.role || "Unknown"}</td>
                <td className="border p-2">{log.action}</td>
                <td className="border p-2">{log.detail || "-"}</td>
                <td className="border p-2">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

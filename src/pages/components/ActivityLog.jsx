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

  // Helper format tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Activity Logs</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada aktivitas</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded-lg">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Akun</th>
                  <th className="border p-3">Role</th>
                  <th className="border p-3">Aksi</th>
                  <th className="border p-3">Detail</th>
                  <th className="border p-3">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="border p-3">{log.id}</td>
                    <td className="border p-3">{log.accounts?.name || "Unknown"}</td>
                    <td className="border p-3">{log.accounts?.role || "-"}</td>
                    <td className="border p-3">{log.action}</td>
                    <td className="border p-3">{log.detail || "-"}</td>
                    <td className="border p-3">{formatDate(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card */}
          <div className="md:hidden grid gap-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white shadow rounded-lg p-4 border space-y-1"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{log.accounts?.name || "Unknown"}</h3>
                  <span className="text-xs text-gray-500">{formatDate(log.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Role:</span> {log.accounts?.role || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Aksi:</span> {log.action}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Detail:</span> {log.detail || "-"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

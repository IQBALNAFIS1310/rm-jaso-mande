// src/components/Reporting.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Reporting() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("5days");

  useEffect(() => {
    fetchSalesData();
  }, [filter]);

  const fetchSalesData = async () => {
    setLoading(true);
    let query = supabase
      .from("transactions")
      .select("id,total,created_at")
      .order("created_at", { ascending: true });

    const now = new Date();
    let startDate;

    if (filter === "5days") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 5);
    } else if (filter === "weekly") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (filter === "monthly") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    } else if (filter === "yearly") {
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
    }

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString());
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Agregasi penjualan per tanggal
    const grouped = {};
    data.forEach((tx) => {
      const date = new Date(tx.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      grouped[date] = (grouped[date] || 0) + tx.total;
    });

    const chartData = Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    }));

    setSalesData(chartData);
    setLoading(false);
  };

  const totalSales = salesData.reduce((acc, cur) => acc + cur.total, 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Laporan Penjualan</h2>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("5days")}
          className={`px-4 py-2 rounded ${
            filter === "5days" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          5 Hari
        </button>
        <button
          onClick={() => setFilter("weekly")}
          className={`px-4 py-2 rounded ${
            filter === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Mingguan
        </button>
        <button
          onClick={() => setFilter("monthly")}
          className={`px-4 py-2 rounded ${
            filter === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Bulanan
        </button>
        <button
          onClick={() => setFilter("yearly")}
          className={`px-4 py-2 rounded ${
            filter === "yearly" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Tahunan
        </button>
      </div>

      {/* Chart */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : salesData.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada data penjualan</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                `Rp ${new Intl.NumberFormat("id-ID").format(value)}`
              }
            />
            <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow text-lg font-semibold">
        Total Penjualan ({filter}):{" "}
        <span className="text-blue-600">
          Rp {totalSales.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Reporting() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("id,total,created_at")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Agregasi penjualan per tanggal
    const grouped = {};
    data.forEach(tx => {
      const date = new Date(tx.created_at).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + tx.total;
    });

    const chartData = Object.entries(grouped).map(([date, total]) => ({
      date,
      total
    }));

    setSalesData(chartData);
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Reporting</h2>
      {loading ? (
        <p>Loading...</p>
      ) : salesData.length === 0 ? (
        <p>Tidak ada data penjualan</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Tambahan: ringkasan total penjualan */}
      <div className="mt-4">
        <strong>Total Penjualan: IDR {salesData.reduce((acc, cur) => acc + cur.total, 0).toLocaleString()}</strong>
      </div>
    </div>
  );
}

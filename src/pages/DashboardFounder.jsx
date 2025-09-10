// src/pages/DashboardFounder.jsx
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function DashboardFounder() {
  const [dailySales, setDailySales] = useState([]);
  const [financeSummary, setFinanceSummary] = useState({ income: 0, expense: 0 });

  // Fetch penjualan harian
  useEffect(() => {
    const fetchDailySales = async () => {
      const { data } = await supabase
        .from("transactions")
        .select("id,total,created_at")
        .order("created_at", { ascending: false });

      // agregasi per tanggal
      const salesByDate = {};
      data.forEach(tx => {
        const date = new Date(tx.created_at).toLocaleDateString();
        salesByDate[date] = (salesByDate[date] || 0) + tx.total;
      });

      setDailySales(Object.entries(salesByDate).map(([date, total]) => ({ date, total })));
    };

    const fetchFinance = async () => {
      const { data } = await supabase.from("finances").select("*");
      let income = 0, expense = 0;
      data.forEach(f => {
        if (f.type === "income") income += f.amount;
        else if (f.type === "expense") expense += f.amount;
      });
      setFinanceSummary({ income, expense });
    };

    fetchDailySales();
    fetchFinance();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Founder</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Penjualan Harian</h2>
        <ul>
          {dailySales.map(s => (
            <li key={s.date}>{s.date}: IDR {s.total}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Laba Rugi</h2>
        <p>Pemasukan: IDR {financeSummary.income}</p>
        <p>Pengeluaran: IDR {financeSummary.expense}</p>
        <p><strong>Laba Bersih: IDR {financeSummary.income - financeSummary.expense}</strong></p>
      </div>
    </div>
  );
}

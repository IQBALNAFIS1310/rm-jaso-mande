// src/pages/DashboardFounder.jsx
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function DashboardFounder() {
  const [sales, setSales] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topMenus, setTopMenus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil transaksi hari ini
      const { data: transactions } = await supabase
        .from("transactions")
        .select(`id, total, created_at, transaction_items(menu_id, quantity, total, price_each, menu_id(name))`)
        .gte('created_at', new Date().toISOString().split('T')[0]) // hari ini

      setSales(transactions || []);

      // total revenue
      const revenue = transactions?.reduce((acc, t) => acc + t.total, 0) || 0;
      setTotalRevenue(revenue);

      // menu terlaris
      const menuCount = {};
      transactions?.forEach(t => {
        t.transaction_items?.forEach(item => {
          if (!menuCount[item.menu_id]) menuCount[item.menu_id] = { name: item.menu_id.name, quantity: 0 };
          menuCount[item.menu_id].quantity += item.quantity;
        })
      });
      setTopMenus(Object.values(menuCount).sort((a,b) => b.quantity - a.quantity).slice(0,5));
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Founder</h1>
      <div className="mb-4">
        <h2 className="font-semibold">Total Penjualan Hari Ini:</h2>
        <p>IDR {totalRevenue.toLocaleString()}</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">Menu Terlaris:</h2>
        <ul>
          {topMenus.map(menu => <li key={menu.name}>{menu.name} - {menu.quantity} pcs</li>)}
        </ul>
      </div>
    </div>
  );
}

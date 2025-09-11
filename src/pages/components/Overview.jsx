import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Overview() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalMenus: 0,
    lowStockMenus: [],
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    // Contoh fetch total transaksi
    const { data: txData } = await supabase
      .from("transactions")
      .select("total");
    const totalRevenue = txData?.reduce((acc, t) => acc + t.total, 0) || 0;

    // Contoh fetch menu & stok menipis
    const { data: menuData } = await supabase.from("menus").select("*");
    const { data: stockData } = await supabase.from("menu_stocks").select("*");
    const lowStockMenus = stockData.filter((s) => s.remaining_stock < 5);

    setSummary({
      totalRevenue,
      totalTransactions: txData?.length || 0,
      totalMenus: menuData?.length || 0,
      lowStockMenus,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
      <p>Total Revenue: Rp {summary.totalRevenue.toLocaleString()}</p>
      <p>Total Transactions: {summary.totalTransactions}</p>
      <p>Total Menus: {summary.totalMenus}</p>
      <p>Menus Low Stock: {summary.lowStockMenus.map(m => m.menu_id).join(", ")}</p>
    </div>
  );
}

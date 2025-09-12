import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import {
  DollarSign,
  ShoppingCart,
  Utensils,
  AlertTriangle,
} from "lucide-react";

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
    // Total transaksi & revenue
    const { data: txData } = await supabase.from("transactions").select("total");
    const totalRevenue = txData?.reduce((acc, t) => acc + t.total, 0) || 0;

    // Menu
    const { data: menuData } = await supabase.from("menus").select("*");
    const { data: stockData } = await supabase.from("menu_stocks").select("*");

    const lowStockMenus = stockData?.filter((s) => s.remaining_stock < 5) || [];

    setSummary({
      totalRevenue,
      totalTransactions: txData?.length || 0,
      totalMenus: menuData?.length || 0,
      lowStockMenus,
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-pink-700">📊 Dashboard Overview</h2>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Revenue */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">
                Rp {summary.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <DollarSign className="text-green-600 w-8 h-8" />
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {summary.totalTransactions}
              </h3>
            </div>
            <ShoppingCart className="text-blue-600 w-8 h-8" />
          </div>
        </div>

        {/* Menus */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Menus</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {summary.totalMenus}
              </h3>
            </div>
            <Utensils className="text-pink-600 w-8 h-8" />
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Menus</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {summary.lowStockMenus.length}
              </h3>
            </div>
            <AlertTriangle className="text-yellow-600 w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Detail Low Stock */}
      {summary.lowStockMenus.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-yellow-700">
            <AlertTriangle className="w-5 h-5" />
            Menus with Low Stock
          </h3>
          <ul className="space-y-2">
            {summary.lowStockMenus.map((m) => (
              <li
                key={m.menu_id}
                className="flex justify-between items-center border-b last:border-none pb-2"
              >
                <span className="font-medium text-gray-700">Menu ID: {m.menu_id}</span>
                <span className="text-sm text-red-600 font-semibold">
                  Sisa: {m.remaining_stock}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

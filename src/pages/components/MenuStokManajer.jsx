import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function MenuStocksManager() {
  const [stocks, setStocks] = useState([]);
  const [menus, setMenus] = useState([]);
  const [newStock, setNewStock] = useState({
    menu_id: "",
    stock_in: 0,
    stock_date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    fetchStocks();
    fetchMenus();
  }, []);

  const fetchStocks = async () => {
    const { data } = await supabase
      .from("menu_stocks")
      .select("*, menus(name)")
      .order("stock_date", { ascending: false });
    setStocks(data || []);
  };

  const fetchMenus = async () => {
    const { data } = await supabase.from("menus").select("*");
    setMenus(data || []);
  };

  const addStock = async () => {
    if (!newStock.menu_id || newStock.stock_in <= 0) return alert("Lengkapi input!");
    const { data } = await supabase.from("menu_stocks").insert([newStock]).select("*, menus(name)");
    if (data) {
      setStocks([data[0], ...stocks]);
      setNewStock({
        menu_id: "",
        stock_in: 0,
        stock_date: new Date().toISOString().slice(0, 10),
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Kelola Stok Menu</h2>

      {/* Form tambah stok */}
      <div className="mb-6 flex flex-col md:flex-row gap-2">
        <select
          value={newStock.menu_id}
          onChange={(e) => setNewStock({ ...newStock, menu_id: Number(e.target.value) })}
          className="border p-2 rounded"
        >
          <option value="">Pilih Menu</option>
          {menus.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Stok Masuk"
          value={newStock.stock_in}
          onChange={(e) => setNewStock({ ...newStock, stock_in: Number(e.target.value) })}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={newStock.stock_date}
          onChange={(e) => setNewStock({ ...newStock, stock_date: e.target.value })}
          className="border p-2 rounded"
        />

        <button
          onClick={addStock}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        >
          Tambah
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border p-3">Tanggal</th>
              <th className="border p-3">Menu</th>
              <th className="border p-3">Stok Masuk</th>
              <th className="border p-3">Stok Keluar</th>
              <th className="border p-3">Sisa Stok</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition">
                <td className="border p-3">{s.stock_date}</td>
                <td className="border p-3">{s.menus?.name}</td>
                <td className="border p-3">{s.stock_in}</td>
                <td className="border p-3">{s.stock_out}</td>
                <td className="border p-3">{s.remaining_stock}</td>
              </tr>
            ))}
            {stocks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                  Belum ada data stok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card */}
      <div className="md:hidden grid gap-4">
        {stocks.length === 0 && (
          <p className="text-gray-500 italic text-center">Belum ada data stok</p>
        )}
        {stocks.map((s) => (
          <div key={s.id} className="bg-white shadow rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{s.menus?.name}</h3>
              <span className="text-sm text-gray-500">{s.stock_date}</span>
            </div>
            <p className="text-sm">
              <span className="font-semibold">Stok Masuk:</span> {s.stock_in}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Stok Keluar:</span> {s.stock_out}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Sisa Stok:</span>{" "}
              <span
                className={`font-bold ${
                  s.remaining_stock < 5 ? "text-red-600" : "text-green-600"
                }`}
              >
                {s.remaining_stock}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

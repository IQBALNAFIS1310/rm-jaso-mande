import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function MenuStocksManager() {
  const [stocks, setStocks] = useState([]);
  const [menus, setMenus] = useState([]);
  const [newStock, setNewStock] = useState({ menu_id: "", stock_in: 0, stock_date: new Date().toISOString().slice(0,10) });

  useEffect(() => {
    fetchStocks();
    fetchMenus();
  }, []);

  const fetchStocks = async () => {
    const { data } = await supabase.from("menu_stocks").select("*, menus(name)").order("stock_date", { ascending: false });
    setStocks(data || []);
  };

  const fetchMenus = async () => {
    const { data } = await supabase.from("menus").select("*");
    setMenus(data || []);
  };

  const addStock = async () => {
    const { data } = await supabase.from("menu_stocks").insert([newStock]);
    setStocks([data[0], ...stocks]);
    setNewStock({ menu_id: "", stock_in: 0, stock_date: new Date().toISOString().slice(0,10) });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Kelola Stok Menu</h2>
      <div className="mb-4 flex gap-2">
        <select value={newStock.menu_id} onChange={e => setNewStock({ ...newStock, menu_id: Number(e.target.value) })} className="border p-1">
          <option value="">Pilih Menu</option>
          {menus.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <input type="number" placeholder="Stok Masuk" value={newStock.stock_in} onChange={e => setNewStock({ ...newStock, stock_in: Number(e.target.value) })} className="border p-1" />
        <input type="date" value={newStock.stock_date} onChange={e => setNewStock({ ...newStock, stock_date: e.target.value })} className="border p-1" />
        <button onClick={addStock} className="bg-green-500 text-white px-2 rounded">Tambah Stok</button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Menu</th>
            <th className="border p-2">Stok Masuk</th>
            <th className="border p-2">Stok Keluar</th>
            <th className="border p-2">Sisa Stok</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.stock_date}</td>
              <td className="border p-2">{s.menus?.name}</td>
              <td className="border p-2">{s.stock_in}</td>
              <td className="border p-2">{s.stock_out}</td>
              <td className="border p-2">{s.remaining_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

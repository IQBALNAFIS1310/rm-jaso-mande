import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function MenusManager() {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({ name: "", price: 0 });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const { data, error } = await supabase.from("menus").select("*");
    if (!error) setMenus(data || []);
  };

  const addMenu = async () => {
    const { data, error } = await supabase.from("menus").insert([newMenu]);
    if (!error) {
      setMenus([...menus, data[0]]);
      setNewMenu({ name: "", price: 0 });
    }
  };

  const deleteMenu = async (id) => {
    await supabase.from("menus").delete().eq("id", id);
    setMenus(menus.filter(m => m.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Kelola Menu</h2>
      <div className="mb-4 flex gap-2">
        <input placeholder="Nama Menu" value={newMenu.name} onChange={e => setNewMenu({ ...newMenu, name: e.target.value })} className="border p-1" />
        <input type="number" placeholder="Harga" value={newMenu.price} onChange={e => setNewMenu({ ...newMenu, price: Number(e.target.value) })} className="border p-1" />
        <button onClick={addMenu} className="bg-green-500 text-white px-2 rounded">Tambah</button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Harga</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {menus.map(m => (
            <tr key={m.id}>
              <td className="border p-2">{m.id}</td>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.price.toLocaleString()}</td>
              <td className="border p-2">
                <button onClick={() => deleteMenu(m.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

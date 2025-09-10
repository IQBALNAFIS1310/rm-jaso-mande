// src/pages/DashboardManager.jsx
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function DashboardManager() {
  const [menus, setMenus] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  // State untuk edit menu
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState(0);

  // Ambil data menu dari Supabase
  useEffect(() => {
    const fetchMenus = async () => {
      const { data } = await supabase.from("menus").select("*");
      setMenus(data || []);
    };
    fetchMenus();
  }, []);

  // Tambah menu baru
  const addMenu = async () => {
    if (!name || price <= 0) return;
    const { data } = await supabase.from("menus").insert({ name, price }).select();
    setMenus([...menus, ...data]);
    setName("");
    setPrice(0);
  };

  // Hapus menu
  const deleteMenu = async (id) => {
    await supabase.from("menus").delete().eq("id", id);
    setMenus(menus.filter(m => m.id !== id));
  };

  // Siapkan edit menu
  const startEdit = (menu) => {
    setEditId(menu.id);
    setEditName(menu.name);
    setEditPrice(menu.price);
  };

  // Simpan edit menu
  const saveEdit = async () => {
    if (!editName || editPrice <= 0) return;
    const { data } = await supabase
      .from("menus")
      .update({ name: editName, price: editPrice })
      .eq("id", editId)
      .select();

    setMenus(menus.map(m => (m.id === editId ? data[0] : m)));
    setEditId(null);
    setEditName("");
    setEditPrice(0);
  };

  // Batal edit
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditPrice(0);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Manager</h1>

      {/* Form Tambah Menu */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Tambah Menu Baru</h2>
        <input
          placeholder="Nama Menu"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          placeholder="Harga"
          type="number"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="border p-2 mr-2"
        />
        <button onClick={addMenu} className="bg-blue-500 text-white p-2 rounded">Tambah</button>
      </div>

      {/* Daftar Menu */}
      <div>
        <h2 className="font-semibold mb-2">Daftar Menu</h2>
        <ul>
          {menus.map(menu => (
            <li key={menu.id} className="flex items-center justify-between mb-2">
              {editId === menu.id ? (
                // Input saat edit
                <div className="flex items-center gap-2">
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="border p-1"
                  />
                  <input
                    type="number"
                    value={editPrice}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="border p-1 w-24"
                  />
                  <button onClick={saveEdit} className="bg-green-500 text-white px-2 rounded">Simpan</button>
                  <button onClick={cancelEdit} className="bg-gray-500 text-white px-2 rounded">Batal</button>
                </div>
              ) : (
                // Tampilkan menu biasa
                <div className="flex items-center justify-between w-full">
                  <span>{menu.name} - IDR {menu.price}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(menu)} className="bg-yellow-500 text-white px-2 rounded">Edit</button>
                    <button onClick={() => deleteMenu(menu.id)} className="bg-red-500 text-white px-2 rounded">Hapus</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

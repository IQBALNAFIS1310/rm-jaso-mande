import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function MenuManager() {
  const [menus, setMenus] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState(0);

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    const { data } = await supabase.from("menus").select("*").order("id");
    setMenus(data || []);
  };

  const addMenu = async () => {
    if (!name || price <= 0) return;
    const { data } = await supabase.from("menus").insert({ name, price }).select();
    setMenus([...menus, ...data]);
    setName(""); 
    setPrice(0);
  };

  const updateMenu = async (id) => {
    if (!editName || editPrice <= 0) return;
    const { data } = await supabase.from("menus")
      .update({ name: editName, price: editPrice })
      .eq("id", id)
      .select();
    setMenus(menus.map(m => m.id === id ? data[0] : m));
    setEditId(null);
  };

  const deleteMenu = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;
    await supabase.from("menus").delete().eq("id", id);
    setMenus(menus.filter(m => m.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      
      {/* Tambah Menu */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Nama Menu" 
          className="border p-2 flex-1"
        />
        <input 
          type="number" 
          value={price} 
          onChange={e => setPrice(Number(e.target.value))} 
          placeholder="Harga" 
          className="border p-2 w-32"
        />
        <button onClick={addMenu} className="bg-blue-500 text-white px-4 rounded">Tambah</button>
      </div>

      {/* Daftar Menu */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Harga</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {menus.map(menu => (
            <tr key={menu.id} className="border">
              {editId === menu.id ? (
                <>
                  <td className="border p-1">
                    <input 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)} 
                      className="border w-full p-1"
                    />
                  </td>
                  <td className="border p-1">
                    <input 
                      type="number" 
                      value={editPrice} 
                      onChange={e => setEditPrice(Number(e.target.value))} 
                      className="border w-full p-1"
                    />
                  </td>
                  <td className="border p-1 flex gap-1">
                    <button onClick={() => updateMenu(menu.id)} className="bg-green-500 text-white px-2 rounded">Simpan</button>
                    <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-2 rounded">Batal</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{menu.name}</td>
                  <td className="border p-2">{menu.price}</td>
                  <td className="border p-2 flex gap-1">
                    <button 
                      onClick={() => { 
                        setEditId(menu.id); 
                        setEditName(menu.name); 
                        setEditPrice(menu.price); 
                      }} 
                      className="bg-yellow-500 text-white px-2 rounded"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteMenu(menu.id)} 
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

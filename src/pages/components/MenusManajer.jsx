import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function MenusManager() {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({ name: "", price: 0 });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: 0 });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // success, error, info

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setMenus(data || []);
  };

  const addMenu = async () => {
    const { error } = await supabase.from("menus").insert([newMenu]);
    if (!error) {
      setMessage("Menu berhasil ditambahkan ✅");
      setMessageType("success");
      setNewMenu({ name: "", price: 0 });
      fetchMenus();
    } else {
      setMessage("Gagal menambah menu: " + error.message);
      setMessageType("error");
    }
  };

  const startEdit = (menu) => {
    setEditId(menu.id);
    setEditData({ name: menu.name, price: menu.price });
  };

  const saveEdit = async (id) => {
    const { error } = await supabase.from("menus").update(editData).eq("id", id);
    if (!error) {
      setMessage("Menu berhasil diubah ✨");
      setMessageType("success");
      setEditId(null);
      fetchMenus();
    } else {
      setMessage("Gagal mengubah menu: " + error.message);
      setMessageType("error");
    }
  };

  const deleteMenu = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;
    const { error } = await supabase.from("menus").delete().eq("id", id);
    if (!error) {
      setMessage("Menu berhasil dihapus 🗑️");
      setMessageType("success");
      fetchMenus();
    } else {
      setMessage("Gagal menghapus menu: " + error.message);
      setMessageType("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-pink-700">🍽️ Kelola Menu</h2>

      {/* Notifikasi */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            messageType === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : messageType === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-blue-100 text-blue-700 border border-blue-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Tambah Menu */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-center bg-gray-50 p-4 rounded-lg shadow-sm">
        <input
          placeholder="Nama Menu"
          value={newMenu.name}
          onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <input
          type="number"
          placeholder="Harga"
          value={newMenu.price}
          onChange={(e) =>
            setNewMenu({ ...newMenu, price: Number(e.target.value) })
          }
          className="border rounded-lg px-3 py-2 w-32"
        />
        <button
          onClick={addMenu}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          Tambah
        </button>
      </div>

      {/* Tabel Menu (Desktop) */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Harga</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((m, idx) => (
              <tr
                key={m.id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-pink-50 transition`}
              >
                <td className="p-3">{m.id}</td>
                <td className="p-3">
                  {editId === m.id ? (
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    m.name
                  )}
                </td>
                <td className="p-3">
                  {editId === m.id ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          price: Number(e.target.value),
                        })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    `Rp ${m.price.toLocaleString()}`
                  )}
                </td>
                <td className="p-3 flex justify-center gap-2">
                  {editId === m.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(m.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(m)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMenu(m.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View (Mobile) */}
      <div className="space-y-4 md:hidden">
        {menus.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-lg shadow p-4 border border-pink-100"
          >
            {editId === m.id ? (
              <>
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="border rounded px-2 py-1 w-full mb-2"
                />
                <input
                  type="number"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      price: Number(e.target.value),
                    })
                  }
                  className="border rounded px-2 py-1 w-full mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(m.id)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-lg"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-gray-600 mb-3">
                  Harga: <span className="font-bold">Rp {m.price.toLocaleString()}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(m)}
                    className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMenu(m.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg"
                  >
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

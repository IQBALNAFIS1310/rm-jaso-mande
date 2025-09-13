import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function MenusManager() {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
    is_visible: true,
  });
  const [newImageFile, setNewImageFile] = useState(null); 
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
    is_visible: true,
  });
  const [editImageFile, setEditImageFile] = useState(null); 
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

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

  const uploadImage = async (file) => {
    if (!file) return "";
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("menus")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("menus").getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (err) {
      setMessage("Gagal upload gambar: " + err.message);
      setMessageType("error");
      return "";
    }
  };

  const addMenu = async () => {
    let imageUrl = "";
    if (newImageFile) imageUrl = await uploadImage(newImageFile);

    const { error } = await supabase.from("menus").insert([
      { ...newMenu, image: imageUrl },
    ]);

    if (!error) {
      setMessage("Menu berhasil ditambahkan ✅");
      setMessageType("success");
      setNewMenu({ name: "", price: 0, description: "", image: "", is_visible: true });
      setNewImageFile(null);
      fetchMenus();
    } else {
      setMessage("Gagal menambah menu: " + error.message);
      setMessageType("error");
    }
  };

  const startEdit = (menu) => {
    setEditId(menu.id);
    setEditData({
      ...menu,
      description: menu.description || "",
    });
    setEditImageFile(null);
  };

  const saveEdit = async (id) => {
    let imageUrl = editData.image;
    if (editImageFile) imageUrl = await uploadImage(editImageFile);

    const { id: _, ...updateData } = editData;

    const { error } = await supabase
      .from("menus")
      .update({ ...updateData, image: imageUrl })
      .eq("id", id);

    if (!error) {
      setMessage("Menu berhasil diubah ✨");
      setMessageType("success");
      setEditId(null);
      setEditImageFile(null);
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
    <div className="max-w-5xl mx-auto p-4">
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
      <div className="mb-6 flex flex-col gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
        <input
          placeholder="Nama Menu"
          value={newMenu.name}
          onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          placeholder="Harga"
          value={newMenu.price}
          onChange={(e) =>
            setNewMenu({ ...newMenu, price: Number(e.target.value) })
          }
          className="border rounded-lg px-3 py-2"
        />
        <textarea
          placeholder="Deskripsi"
          value={newMenu.description}
          onChange={(e) =>
            setNewMenu({ ...newMenu, description: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="file"
          onChange={(e) => setNewImageFile(e.target.files[0])}
          className="border rounded-lg px-3 py-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newMenu.is_visible}
            onChange={(e) =>
              setNewMenu({ ...newMenu, is_visible: e.target.checked })
            }
          />
          Tampilkan di profil
        </label>
        <button
          onClick={addMenu}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          Tambah
        </button>
      </div>

      {/* Card/Grid Menu untuk mobile/tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {menus.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
          >
            {editId === m.id ? (
              <>
                <input
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="border rounded px-2 py-1 mb-2"
                  placeholder="Nama Menu"
                />
                <input
                  type="number"
                  value={editData.price || 0}
                  onChange={(e) =>
                    setEditData({ ...editData, price: Number(e.target.value) })
                  }
                  className="border rounded px-2 py-1 mb-2"
                  placeholder="Harga"
                />
                <textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="border rounded px-2 py-1 mb-2"
                  placeholder="Deskripsi"
                />
                <input
                  type="file"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                  className="mb-2"
                />
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={editData.is_visible}
                    onChange={(e) =>
                      setEditData({ ...editData, is_visible: e.target.checked })
                    }
                  />
                  Tampilkan di profil
                </label>
                <div className="flex gap-2">
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
                </div>
              </>
            ) : (
              <>
                {m.image && (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-32 w-full object-cover rounded mb-2"
                  />
                )}
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{m.description}</p>
                <p className="font-medium mb-1">Rp {m.price.toLocaleString()}</p>
                <p className="mb-2">{m.is_visible ? "✅ Visible" : "❌ Hidden"}</p>
                <div className="flex gap-2">
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
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

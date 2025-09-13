import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function FinanceManager() {
  const [finances, setFinances] = useState([]);
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState("income");
  const [editAmount, setEditAmount] = useState(0);
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState(new Date().toISOString().slice(0, 10));

  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  useEffect(() => { fetchFinances(); }, []);

  const fetchFinances = async () => {
    const { data } = await supabase.from("finances").select("*");
    setFinances(data || []);
  };

  const addFinance = async () => {
    if (!amount || amount <= 0 || !category || !description) {
      alert("Harap isi semua field dengan benar!");
      return;
    }
    const { data } = await supabase.from("finances").insert({
      type, amount, category, description, date
    }).select();
    setFinances([data[0], ...finances]);
    setType("income"); setAmount(0); setCategory(""); setDescription(""); setDate(new Date().toISOString().slice(0, 10));
  };

  const updateFinance = async (id) => {
    if (!editAmount || editAmount <= 0 || !editCategory || !editDescription) {
      alert("Harap isi semua field dengan benar!");
      return;
    }
    const { data } = await supabase.from("finances").update({
      type: editType, amount: editAmount, category: editCategory, description: editDescription, date: editDate
    }).eq("id", id).select();
    setFinances(finances.map(f => f.id === id ? data[0] : f));
    setEditId(null);
  };

  const deleteFinance = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data keuangan ini?")) return;
    await supabase.from("finances").delete().eq("id", id);
    setFinances(finances.filter(f => f.id !== id));
  };

  const filteredFinances = finances
    .filter(f => !filterDate || f.date === filterDate)
    .filter(f => !filterCategory || f.category.toLowerCase().includes(filterCategory.toLowerCase()))
    .filter(f => !searchKeyword || f.description.toLowerCase().includes(searchKeyword.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "amount_asc") return a.amount - b.amount;
      if (sortBy === "amount_desc") return b.amount - a.amount;
      return 0;
    });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">💰 Manajemen Keuangan</h2>

      {/* Add Finance */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-2">Tambah Transaksi</h3>
        <div className="flex gap-2 flex-wrap">
          <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded">
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
          <input type="number" placeholder="Jumlah" value={amount} onChange={e => setAmount(Number(e.target.value))} className="border p-2 rounded" />
          <input placeholder="Kategori" value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded" />
          <input placeholder="Deskripsi" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
          <button onClick={addFinance} className="bg-green-600 hover:bg-green-700 text-white px-4 rounded">Tambah</button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-2 flex-wrap items-center">
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Filter kategori" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Cari deskripsi" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} className="border p-2 rounded" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2 rounded">
          <option value="date_desc">Tanggal Terbaru</option>
          <option value="date_asc">Tanggal Terlama</option>
          <option value="amount_desc">Jumlah Terbesar</option>
          <option value="amount_asc">Jumlah Terkecil</option>
        </select>
        <button onClick={fetchFinances} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded">Reset</button>
      </div>

      {/* 📱 Mobile: Card View */}
      <div className="md:hidden space-y-4">
        {filteredFinances.map((f) => (
          <div
            key={f.id}
            className="bg-white border rounded-lg shadow p-4 space-y-2"
          >
            {editId === f.id ? (
              <div className="space-y-2">
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>
                <input
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Kategori"
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                  placeholder="Jumlah"
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Deskripsi"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateFinance(f.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{f.date}</span>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${f.type === "income" ? "bg-green-500" : "bg-red-500"
                      }`}
                  >
                    {f.type === "income" ? "Pemasukan" : "Pengeluaran"}
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  Rp {f.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{f.category}</span> •{" "}
                  {f.description}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setEditId(f.id);
                      setEditType(f.type);
                      setEditAmount(f.amount);
                      setEditCategory(f.category);
                      setEditDescription(f.description);
                      setEditDate(f.date);
                    }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFinance(f.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 💻 Desktop: Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Tipe</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Deskripsi</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredFinances.map((f) => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                {editId === f.id ? (
                  <>
                    <td className="p-2">
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="border p-1 rounded w-full"
                      >
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(Number(e.target.value))}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2 flex gap-1">
                      <button
                        onClick={() => updateFinance(f.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 rounded"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 rounded"
                      >
                        Batal
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{f.date}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${f.type === "income" ? "bg-green-500" : "bg-red-500"
                          }`}
                      >
                        {f.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td className="p-2">{f.category}</td>
                    <td
                      className={`p-2 font-semibold ${f.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      Rp {f.amount.toLocaleString()}
                    </td>
                    <td className="p-2">{f.description}</td>
                    <td className="p-2 flex gap-1">
                      <button
                        onClick={() => {
                          setEditId(f.id);
                          setEditType(f.type);
                          setEditAmount(f.amount);
                          setEditCategory(f.category);
                          setEditDescription(f.description);
                          setEditDate(f.date);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFinance(f.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 rounded"
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
    </div>
  );
}

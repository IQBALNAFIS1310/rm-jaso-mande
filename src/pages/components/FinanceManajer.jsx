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

  // FILTER & SEARCH
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
    if (!amount || amount <= 0) return;
    const { data } = await supabase.from("finances").insert({
      type, amount, category, description, date
    }).select();
    setFinances([data[0], ...finances]);
    setType("income"); setAmount(0); setCategory(""); setDescription(""); setDate(new Date().toISOString().slice(0,10));
  };

  const updateFinance = async (id) => {
    const { data } = await supabase.from("finances").update({
      type: editType, amount: editAmount, category: editCategory, description: editDescription, date: editDate
    }).eq("id", id).select();
    setFinances(finances.map(f => f.id === id ? data[0] : f));
    setEditId(null);
  };

  const deleteFinance = async (id) => {
    await supabase.from("finances").delete().eq("id", id);
    setFinances(finances.filter(f => f.id !== id));
  };

  // FILTERING & SEARCHING
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
    <div>
      <h2 className="text-xl font-bold mb-4">Keuangan</h2>

      {/* Add Finance */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select value={type} onChange={e => setType(e.target.value)} className="border p-2">
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
        <input type="number" placeholder="Jumlah" value={amount} onChange={e => setAmount(Number(e.target.value))} className="border p-2"/>
        <input placeholder="Kategori" value={category} onChange={e => setCategory(e.target.value)} className="border p-2"/>
        <input placeholder="Deskripsi" value={description} onChange={e => setDescription(e.target.value)} className="border p-2"/>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2"/>
        <button onClick={addFinance} className="bg-green-500 text-white px-4 rounded">Tambah</button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="border p-2" placeholder="Filter tanggal"/>
        <input placeholder="Filter kategori" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border p-2"/>
        <input placeholder="Cari deskripsi" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} className="border p-2"/>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2">
          <option value="date_desc">Tanggal Terbaru</option>
          <option value="date_asc">Tanggal Terlama</option>
          <option value="amount_desc">Jumlah Terbesar</option>
          <option value="amount_asc">Jumlah Terkecil</option>
        </select>
        <button onClick={fetchFinances} className="bg-blue-500 text-white px-4 rounded">Reset Filter</button>
      </div>

      {/* Finance List */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Tipe</th>
            <th className="border p-2">Kategori</th>
            <th className="border p-2">Jumlah</th>
            <th className="border p-2">Deskripsi</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredFinances.map(f => (
            <tr key={f.id} className="border">
              {editId === f.id ? (
                <>
                  <td className="border p-1"><input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="border p-1 w-full"/></td>
                  <td className="border p-1">
                    <select value={editType} onChange={e => setEditType(e.target.value)} className="border p-1 w-full">
                      <option value="income">Pemasukan</option>
                      <option value="expense">Pengeluaran</option>
                    </select>
                  </td>
                  <td className="border p-1"><input value={editCategory} onChange={e => setEditCategory(e.target.value)} className="border p-1 w-full"/></td>
                  <td className="border p-1"><input type="number" value={editAmount} onChange={e => setEditAmount(Number(e.target.value))} className="border p-1 w-full"/></td>
                  <td className="border p-1"><input value={editDescription} onChange={e => setEditDescription(e.target.value)} className="border p-1 w-full"/></td>
                  <td className="border p-1 flex gap-1">
                    <button onClick={() => updateFinance(f.id)} className="bg-green-500 text-white px-2 rounded">Simpan</button>
                    <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-2 rounded">Batal</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{f.date}</td>
                  <td className="border p-2">{f.type}</td>
                  <td className="border p-2">{f.category}</td>
                  <td className="border p-2">{f.amount}</td>
                  <td className="border p-2">{f.description}</td>
                  <td className="border p-2 flex gap-1">
                    <button onClick={() => {
                      setEditId(f.id); 
                      setEditType(f.type); 
                      setEditAmount(f.amount); 
                      setEditCategory(f.category); 
                      setEditDescription(f.description); 
                      setEditDate(f.date);
                    }} className="bg-yellow-500 text-white px-2 rounded">Edit</button>
                    <button onClick={() => deleteFinance(f.id)} className="bg-red-500 text-white px-2 rounded">Hapus</button>
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

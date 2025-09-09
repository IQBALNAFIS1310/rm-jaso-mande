import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Dashboard() {
  const [form, setForm] = useState({
    date: "",
    type: "expense",
    amount: "",
    category: "",
    description: "",
  });
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [message, setMessage] = useState(null); // 🔔 untuk notifikasi

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let { data, error } = await supabase
      .from("finances")
      .select("*")
      .order("date", { ascending: false });

    if (error) console.error(error);
    else {
      setRecords(data);
      calculateSummary(data);
    }
  };

  const calculateSummary = (data) => {
    let income = 0, expense = 0;
    data.forEach((d) => {
      if (d.type === "income") income += d.amount;
      else expense += d.amount;
    });
    setSummary({ income, expense, balance: income - expense });
  };

  const addTransaction = async () => {
    // validasi sederhana
    if (!form.amount || !form.date) {
      setMessage({ type: "error", text: "Tanggal dan Jumlah wajib diisi!" });
      return;
    }

    const { error } = await supabase.from("finances").insert([form]);
    if (error) {
      console.error(error);
      setMessage({ type: "error", text: "Gagal menambahkan transaksi." });
    } else {
      setMessage({ type: "success", text: "Transaksi berhasil ditambahkan!" });

      // reset form tapi tanggal tetap dipertahankan
      setForm({
        ...form,
        amount: "",
        category: "",
        description: "",
      });

      fetchData();
    }

    // otomatis hilang setelah 3 detik
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-sm text-gray-600">Total Income</h2>
          <p className="text-xl font-bold text-green-700">
            Rp {summary.income.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-sm text-gray-600">Total Expense</h2>
          <p className="text-xl font-bold text-red-700">
            Rp {summary.expense.toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-sm text-gray-600">Saldo Akhir</h2>
          <p className="text-xl font-bold text-blue-700">
            Rp {summary.balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Notifikasi */}
      {message && (
        <div
          className={`p-3 rounded ${
            message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form Input */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Tambah Transaksi</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
          <input
            type="number"
            placeholder="Jumlah"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) || "" })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="Kategori"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Keterangan"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded col-span-2"
          />
          <button
            onClick={addTransaction}
            className="bg-blue-600 text-white py-2 rounded col-span-2"
          >
            Simpan
          </button>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Daftar Transaksi</h2>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Jenis</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Jumlah</th>
              <th className="border p-2">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.date}</td>
                <td className="p-2">{r.type}</td>
                <td className="p-2">{r.category}</td>
                <td className="p-2">Rp {r.amount.toLocaleString()}</td>
                <td className="p-2">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

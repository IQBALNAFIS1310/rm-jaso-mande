import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [detailId, setDetailId] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editTotal, setEditTotal] = useState(0);
  const [editItems, setEditItems] = useState("");

  const [newTotal, setNewTotal] = useState(0);
  const [newItems, setNewItems] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, transaction_items(*), transaction_payments(*)")
      .order("created_at", { ascending: false });
    if (!error) setTransactions(data || []);
  };

  const fetchDetail = async (id) => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, transaction_items(*, menus(name)), transaction_payments(*)")
      .eq("id", id)
      .single();
    if (!error) {
      setDetailData(data);
      setDetailId(id);
    }
  };

  const addTransaction = async () => {
    if (!newTotal || !newItems) return alert("Total dan items harus diisi");

    const itemsArray = newItems.split(",").map((i) => {
      const [q, menuId] = i.trim().split("x").map((s) => s.trim());
      return { menu_id: Number(menuId), quantity: Number(q), price_each: 0, total: 0 };
    });

    const { data, error } = await supabase.from("transactions").insert({ total: newTotal }).select();
    if (error) return alert("Gagal menambah transaksi");

    const transactionId = data[0].id;

    await supabase.from("transaction_items").insert(
      itemsArray.map((i) => ({ ...i, transaction_id: transactionId, total: i.quantity * i.price_each }))
    );

    fetchTransactions();
    setNewTotal(0);
    setNewItems("");
  };

  const updateTransaction = async (id) => {
    if (!editTotal || !editItems) return alert("Total dan items harus diisi");

    const itemsArray = editItems.split(",").map((i) => {
      const [q, menuId] = i.trim().split("x").map((s) => s.trim());
      return { menu_id: Number(menuId), quantity: Number(q), price_each: 0, total: 0 };
    });

    await supabase.from("transactions").update({ total: editTotal }).eq("id", id);
    await supabase.from("transaction_items").delete().eq("transaction_id", id);
    await supabase.from("transaction_items").insert(
      itemsArray.map((i) => ({ ...i, transaction_id: id, total: i.quantity * i.price_each }))
    );

    fetchTransactions();
    setEditId(null);
  };

  const deleteTransaction = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    await supabase.from("transaction_items").delete().eq("transaction_id", id);
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions(transactions.filter((t) => t.id !== id));
    if (detailId === id) {
      setDetailId(null);
      setDetailData(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transaksi</h2>

      {/* Form tambah transaksi sederhana */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Tambah Transaksi Baru</h3>
        <input
          type="number"
          placeholder="Total"
          value={newTotal}
          onChange={(e) => setNewTotal(Number(e.target.value))}
          className="border p-2 mr-2 rounded w-32"
        />
        <input
          type="text"
          placeholder="Items (contoh: 2x 1, 1x 2)"
          value={newItems}
          onChange={(e) => setNewItems(e.target.value)}
          className="border p-2 mr-2 rounded w-64"
        />
        <button onClick={addTransaction} className="bg-green-600 text-white px-4 py-2 rounded">
          Tambah
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Items</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border">
              {editId === tx.id ? (
                <>
                  <td className="border p-1">{tx.id}</td>
                  <td className="border p-1">{new Date(tx.created_at).toLocaleString()}</td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={editTotal}
                      onChange={(e) => setEditTotal(Number(e.target.value))}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      value={editItems}
                      onChange={(e) => setEditItems(e.target.value)}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="border p-1 flex gap-1">
                    <button
                      onClick={() => updateTransaction(tx.id)}
                      className="bg-green-500 text-white px-2 rounded"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 text-white px-2 rounded"
                    >
                      Batal
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{tx.id}</td>
                  <td className="border p-2">{new Date(tx.created_at).toLocaleString()}</td>
                  <td className="border p-2">{tx.total.toLocaleString()}</td>
                  <td className="border p-2">
                    {tx.transaction_items.map((item) => `${item.quantity}x ${item.menu_id}`).join(", ")}
                  </td>
                  <td className="border p-2 flex gap-1">
                    <button
                      onClick={() => fetchDetail(tx.id)}
                      className="bg-blue-500 text-white px-2 rounded"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => {
                        setEditId(tx.id);
                        setEditTotal(tx.total);
                        setEditItems(tx.transaction_items.map((item) => `${item.quantity}x ${item.menu_id}`).join(", "));
                      }}
                      className="bg-yellow-500 text-white px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}

          {/* Baris detail transaksi */}
          {detailId && detailData && (
            <tr>
              <td colSpan={5} className="bg-gray-100 p-4">
                <h3 className="font-semibold mb-2">Detail Transaksi #{detailId}</h3>
                <div>
                  <strong>Items:</strong>
                  <ul>
                    {detailData.transaction_items.map((item) => (
                      <li key={item.id}>
                        {item.quantity} x {item.menus?.name || item.menu_id} @ Rp {item.price_each.toLocaleString()} = Rp{" "}
                        {item.total.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <strong>Detail Pembayaran (Pecahan Uang):</strong>
                  {detailData.transaction_payments.length === 0 ? (
                    <p>Tidak ada data pecahan pembayaran</p>
                  ) : (
                    <ul>
                      {detailData.transaction_payments.map((pay) => (
                        <li key={pay.id}>
                          Rp {pay.denomination.toLocaleString()} x {pay.quantity} = Rp{" "}
                          {(pay.denomination * pay.quantity).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button onClick={() => setDetailId(null)} className="mt-2 bg-gray-300 px-3 py-1 rounded">
                  Tutup Detail
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
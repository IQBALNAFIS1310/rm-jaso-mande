import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [detailId, setDetailId] = useState(null);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, transaction_items(*, menus(name)), transaction_payments(*)")
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

  const deleteTransaction = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;

    try {
      // Hapus data anak dulu
      await supabase.from("transaction_items").delete().eq("transaction_id", id);
      await supabase.from("transaction_payments").delete().eq("transaction_id", id);
      // Hapus transaksi
      await supabase.from("transactions").delete().eq("id", id);

      setTransactions(transactions.filter((t) => t.id !== id));
      if (detailId === id) {
        setDetailId(null);
        setDetailData(null);
      }
    } catch (err) {
      alert("Gagal menghapus transaksi: " + err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transaksi</h2>

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
              <td className="border p-2">{tx.id}</td>
              <td className="border p-2">{new Date(tx.created_at).toLocaleString()}</td>
              <td className="border p-2">{tx.total.toLocaleString()}</td>
              <td className="border p-2">
                {tx.transaction_items.map((item) => `${item.quantity}x ${item.menus?.name || item.menu_id}`).join(", ")}
              </td>
              <td className="border p-2 flex gap-1">
                <button
                  onClick={() => fetchDetail(tx.id)}
                  className="bg-blue-500 text-white px-2 rounded"
                >
                  Detail
                </button>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}

          {/* Detail transaksi */}
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
                <button
                  onClick={() => setDetailId(null)}
                  className="mt-2 bg-gray-300 px-3 py-1 rounded"
                >
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

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [openDetail, setOpenDetail] = useState(null);

  // filter & sorting
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = terbaru duluan

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // transaksi per halaman
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [page, sortOrder, dateFrom, dateTo]);

  const fetchTransactions = async () => {
    let query = supabase
      .from("transactions")
      .select("*, transaction_items(*, menus(name)), transaction_payments(*)", {
        count: "exact",
      })
      .order("created_at", { ascending: sortOrder === "asc" })
      .range((page - 1) * limit, page * limit - 1);

    if (dateFrom) query = query.gte("created_at", dateFrom + " 00:00:00");
    if (dateTo) query = query.lte("created_at", dateTo + " 23:59:59");

    const { data, error, count } = await query;
    if (!error) {
      setTransactions(data || []);
      setTotalCount(count || 0);
    }
  };

  const deleteTransaction = async (id) => {
    if (!confirm("Apakah kamu yakin ingin menghapus transaksi ini?")) return;

    try {
      await supabase.from("transaction_items").delete().eq("transaction_id", id);
      await supabase.from("transaction_payments").delete().eq("transaction_id", id);
      await supabase.from("transactions").delete().eq("id", id);

      setTransactions(transactions.filter((t) => t.id !== id));
      if (openDetail === id) setOpenDetail(null);
      alert("Transaksi berhasil dihapus ✨");
    } catch (err) {
      alert("Gagal menghapus transaksi: " + err.message);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">💖 Transaksi</h2>

      {/* Filter & Sort */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex gap-2 items-center">
          <label className="text-sm">Dari:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setPage(1);
              setDateFrom(e.target.value);
            }}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm">Sampai:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setPage(1);
              setDateTo(e.target.value);
            }}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-sm"
        >
          Urutkan: {sortOrder === "asc" ? "Terlama → Terbaru" : "Terbaru → Terlama"}
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <>
                <tr
                  key={tx.id}
                  className="border-b hover:bg-pink-50 transition-colors"
                >
                  <td className="p-3">{tx.id}</td>
                  <td className="p-3">
                    {new Date(tx.created_at).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",  // bisa "short" kalau mau singkat
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false   // biar format 24 jam
                    })}
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    Rp {tx.total.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {tx.transaction_items
                      .map(
                        (item) =>
                          `${item.quantity}x ${item.menus?.name || item.menu_id
                          }`
                      )
                      .join(", ")}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        setOpenDetail(openDetail === tx.id ? null : tx.id)
                      }
                      className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {openDetail === tx.id ? "Tutup" : "Detail"}
                    </button>
                    {/* <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Hapus
                    </button> */}
                  </td>
                </tr>

                {/* Detail inline row */}
                {openDetail === tx.id && (
                  <tr className="bg-pink-50">
                    <td colSpan={5} className="p-4">
                      <h3 className="font-semibold text-pink-700 mb-2">
                        Detail Transaksi #{tx.id}
                      </h3>
                      <div>
                        <strong className="block mb-1">Items:</strong>
                        <ul className="list-disc pl-5 text-gray-700">
                          {tx.transaction_items.map((item) => (
                            <li key={item.id}>
                              {item.quantity} x {item.menus?.name || item.menu_id} @ Rp{" "}
                              {item.price_each.toLocaleString()} = Rp{" "}
                              {item.total.toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3">
                        <strong className="block mb-1">Pembayaran:</strong>
                        {tx.transaction_payments.length === 0 ? (
                          <p className="text-gray-500 italic">
                            Tidak ada data pecahan pembayaran
                          </p>
                        ) : (
                          <ul className="list-disc pl-5 text-gray-700">
                            {tx.transaction_payments.map((pay) => (
                              <li key={pay.id}>
                                Rp {pay.denomination.toLocaleString()} x {pay.quantity} = Rp{" "}
                                {(pay.denomination * pay.quantity).toLocaleString()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white shadow-md rounded-xl p-4 border border-pink-100"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {new Date(tx.created_at).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",  // bisa "short" kalau mau singkat
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false   // biar format 24 jam
                })}
              </span>
              <span className="font-semibold text-green-600">
                Rp {tx.total.toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {tx.transaction_items
                .map(
                  (item) =>
                    `${item.quantity}x ${item.menus?.name || item.menu_id}`
                )
                .join(", ")}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() =>
                  setOpenDetail(openDetail === tx.id ? null : tx.id)
                }
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                {openDetail === tx.id ? "Tutup" : "Detail"}
              </button>
              {/* <button
                onClick={() => deleteTransaction(tx.id)}
                className="flex-1 bg-red-400 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
              >
                Hapus
              </button> */}
            </div>

            {/* Inline Detail for Mobile */}
            {openDetail === tx.id && (
              <div className="mt-3 bg-pink-50 rounded-lg p-3 text-sm">
                <strong className="block mb-1">Items:</strong>
                <ul className="list-disc pl-5 text-gray-700">
                  {tx.transaction_items.map((item) => (
                    <li key={item.id}>
                      {item.quantity} x {item.menus?.name || item.menu_id} = Rp{" "}
                      {item.total.toLocaleString()}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <strong className="block mb-1">Pembayaran:</strong>
                  {tx.transaction_payments.length === 0 ? (
                    <p className="text-gray-500 italic">
                      Tidak ada data pecahan pembayaran
                    </p>
                  ) : (
                    <ul className="list-disc pl-5 text-gray-700">
                      {tx.transaction_payments.map((pay) => (
                        <li key={pay.id}>
                          Rp {pay.denomination.toLocaleString()} x {pay.quantity}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 py-1 text-sm text-gray-600">
          Halaman {page} dari {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

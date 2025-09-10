import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTotal, setEditTotal] = useState(0);
  const [editItems, setEditItems] = useState("");
  const [newTotal, setNewTotal] = useState(0);
  const [newItems, setNewItems] = useState("");

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*, transaction_items(*)")
      .order("created_at", { ascending: false });
    setTransactions(data || []);
  };

  const addTransaction = async () => {
    if (!newTotal || !newItems) return;

    // parsing items format: "2x 1, 1x 2" => [{menu_id, quantity, price_each}]
    const itemsArray = newItems.split(",").map(i => {
      const [q, id] = i.trim().split("x").map(s => s.trim());
      return { menu_id: Number(id), quantity: Number(q), price_each: 0, total: 0 }; // price_each bisa fetch dari menu kalau perlu
    });

    const { data } = await supabase.from("transactions").insert({ total: newTotal }).select();
    const transactionId = data[0].id;

    await supabase.from("transaction_items").insert(
      itemsArray.map(i => ({ ...i, transaction_id: transactionId, total: i.quantity * i.price_each }))
    );

    fetchTransactions();
    setNewTotal(0);
    setNewItems("");
  };

  const updateTransaction = async (id) => {
    if (!editTotal || !editItems) return;

    const itemsArray = editItems.split(",").map(i => {
      const [q, menuId] = i.trim().split("x").map(s => s.trim());
      return { menu_id: Number(menuId), quantity: Number(q), price_each: 0, total: 0 };
    });

    await supabase.from("transactions").update({ total: editTotal }).eq("id", id);
    await supabase.from("transaction_items").delete().eq("transaction_id", id);
    await supabase.from("transaction_items").insert(
      itemsArray.map(i => ({ ...i, transaction_id: id, total: i.quantity * i.price_each }))
    );

    fetchTransactions();
    setEditId(null);
  };

  const deleteTransaction = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    await supabase.from("transaction_items").delete().eq("transaction_id", id);
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transaksi</h2>

      {/* Tambah */}
      <div className="flex gap-2 mb-4">
        <input type="number" placeholder="Total" value={newTotal} onChange={e => setNewTotal(Number(e.target.value))} className="border p-2"/>
        <input placeholder="Items (format: 2x 1, 1x 2)" value={newItems} onChange={e => setNewItems(e.target.value)} className="border p-2"/>
        <button onClick={addTransaction} className="bg-green-500 text-white px-4 rounded">Tambah</button>
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
          {transactions.map(tx => (
            <tr key={tx.id} className="border">
              {editId === tx.id ? (
                <>
                  <td className="border p-1">{tx.id}</td>
                  <td className="border p-1">{tx.created_at}</td>
                  <td className="border p-1">
                    <input type="number" value={editTotal} onChange={e => setEditTotal(Number(e.target.value))} className="border p-1 w-full"/>
                  </td>
                  <td className="border p-1">
                    <input value={editItems} onChange={e => setEditItems(e.target.value)} className="border p-1 w-full"/>
                  </td>
                  <td className="border p-1 flex gap-1">
                    <button onClick={() => updateTransaction(tx.id)} className="bg-green-500 text-white px-2 rounded">Simpan</button>
                    <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-2 rounded">Batal</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{tx.id}</td>
                  <td className="border p-2">{tx.created_at}</td>
                  <td className="border p-2">{tx.total}</td>
                  <td className="border p-2">{tx.transaction_items.map(item => `${item.quantity}x ${item.menu_id}`).join(", ")}</td>
                  <td className="border p-2 flex gap-1">
                    <button onClick={() => {
                      setEditId(tx.id);
                      setEditTotal(tx.total);
                      setEditItems(tx.transaction_items.map(item => `${item.quantity}x ${item.menu_id}`).join(", "));
                    }} className="bg-yellow-500 text-white px-2 rounded">Edit</button>
                    <button onClick={() => deleteTransaction(tx.id)} className="bg-red-500 text-white px-2 rounded">Hapus</button>
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

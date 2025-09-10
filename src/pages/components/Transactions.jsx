import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    const { data } = await supabase.from("transactions").select("*, transaction_items(*)").order("created_at", { ascending: false });
    setTransactions(data || []);
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
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id} className="border">
              <td className="border p-2">{tx.id}</td>
              <td className="border p-2">{tx.created_at}</td>
              <td className="border p-2">{tx.total}</td>
              <td className="border p-2">
                {tx.transaction_items.map(item => `${item.quantity}x ${item.menu_id}`).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

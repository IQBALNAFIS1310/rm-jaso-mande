// src/pages/Kasir.jsx
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Transactions from "./components/Transactions";

export default function Kasir() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState(0);
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(0);
  const [msg, setMsg] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    const fetchMenus = async () => {
      let { data, error } = await supabase.from("menus").select("*");
      if (!error) setMenus(data);
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotal(newTotal);
    setChange(payment - newTotal);
  }, [cart, payment]);

  const addDenomination = (val) => {
    setPayment(payment + val);
    setPaymentDetails(prev => ({
      ...prev,
      [val]: (prev[val] || 0) + 1,
    }));
  };


  const addToCart = (menu) => {
    const exists = cart.find((item) => item.id === menu.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === menu.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...menu, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const handlePay = async () => {
    if (total === 0) return setMsg("Keranjang kosong!");
    if (payment < total) return setMsg("Uang kurang!");

    const { data: trx, error } = await supabase
      .from("transactions")
      .insert([{ total, payment_method: "cash" }])
      .select()
      .single();

    if (error) return setMsg("Gagal menyimpan transaksi");

    const items = cart.map((item) => ({
      transaction_id: trx.id,
      menu_id: item.id,
      quantity: item.qty,
      price_each: item.price,
      total: item.price * item.qty,
    }));

    const paymentItems = Object.entries(paymentDetails).map(([denomination, quantity]) => ({
      transaction_id: trx.id,
      denomination: parseInt(denomination),
      quantity,
    }));
    const { error: paymentError } = await supabase.from("transaction_payments").insert(paymentItems);
    if (paymentError) {
      setMsg("Gagal menyimpan detail pembayaran");
      return;
    }


    const { error: itemError } = await supabase.from("transaction_items").insert(items);

    if (itemError) setMsg("Gagal menyimpan item transaksi");
    else {
      setMsg("Transaksi berhasil!");
      setCart([]);
      setPayment(0);
      setPaymentDetails({}); // reset pecahan uang
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Kasir</h1>

      {msg && <div className="p-2 bg-yellow-100 rounded">{msg}</div>}

      {/* Daftar Menu */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="p-3 bg-white rounded shadow flex flex-col items-center"
          >
            <h2 className="font-semibold text-center">{menu.name}</h2>
            <p className="text-sm mt-1">Rp {menu.price.toLocaleString()}</p>
            <button
              onClick={() => addToCart(menu)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded w-full"
            >
              Tambah
            </button>
          </div>
        ))}
      </div>

      {/* Keranjang */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Keranjang</h2>
        {cart.length === 0 ? (
          <p>Belum ada item</p>
        ) : (
          <table className="w-full min-w-[400px] border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Menu</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Harga</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.qty}</td>
                  <td className="border p-2">Rp {item.price.toLocaleString()}</td>
                  <td className="border p-2">Rp {(item.price * item.qty).toLocaleString()}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pembayaran */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="text-lg font-semibold">Pembayaran</h2>
        <p>Total: Rp {total.toLocaleString()}</p>
        <input
          type="number"
          placeholder="Uang dibayar"
          value={payment}
          onChange={(e) => setPayment(parseInt(e.target.value) || 0)}
          className="border p-2 rounded w-full"
        />
        <div className="flex flex-wrap gap-2">
          {[500, 1000, 2000, 5000, 10000, 20000, 50000, 100000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => addDenomination(val)}
              className="bg-gray-200 px-3 py-1 rounded text-sm"
            >
              +{val.toLocaleString()}
            </button>
          ))}
        </div>
        <p>Kembalian: Rp {change >= 0 ? change.toLocaleString() : 0}</p>
        <button
          onClick={handlePay}
          className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          Bayar
        </button>
      </div>
      {/* <Transactions/> */}
    </div>
  );
}
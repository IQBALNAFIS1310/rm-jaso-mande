// src/pages/Kasir.jsx
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";

export default function Kasir() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState(0);
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(0);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [paymentDetails, setPaymentDetails] = useState({});
  const [showCart, setShowCart] = useState(false);

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
    setPaymentDetails((prev) => ({
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

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) =>
    setCart(cart.filter((item) => item.id !== id));

  const handlePay = async () => {
    if (total === 0)
      return setMsg({ type: "warning", text: "Keranjang kosong!" });
    if (payment < total)
      return setMsg({ type: "error", text: "Uang kurang!" });

    const { data: trx, error } = await supabase
      .from("transactions")
      .insert([{ total, payment_method: "cash" }])
      .select()
      .single();

    if (error) return setMsg({ type: "error", text: "Gagal menyimpan transaksi" });

    const items = cart.map((item) => ({
      transaction_id: trx.id,
      menu_id: item.id,
      quantity: item.qty,
      price_each: item.price,
      total: item.price * item.qty,
    }));

    const paymentItems = Object.entries(paymentDetails).map(
      ([denomination, quantity]) => ({
        transaction_id: trx.id,
        denomination: parseInt(denomination),
        quantity,
      })
    );

    await supabase.from("transaction_payments").insert(paymentItems);
    await supabase.from("transaction_items").insert(items);

    setMsg({ type: "success", text: "Transaksi berhasil!" });
    setCart([]);
    setPayment(0);
    setPaymentDetails({});
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Alert */}
      {msg.text && (
        <div
          className={`p-2 text-center text-sm ${
            msg.type === "success"
              ? "bg-green-100 text-green-700"
              : msg.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="p-3 bg-white rounded-lg shadow flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              🍽️
            </div>
            <h2 className="font-semibold">{menu.name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Rp {menu.price.toLocaleString()}
            </p>
            <button
              onClick={() => addToCart(menu)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded w-full text-sm"
            >
              Tambah
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Payment Bar */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg p-3 space-y-3">
        {/* Cart Toggle */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="flex items-center justify-between w-full px-3 py-2 bg-gray-100 rounded"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} />
            <span>Keranjang ({cart.length})</span>
          </div>
          <span className="font-semibold">Rp {total.toLocaleString()}</span>
        </button>

        {/* Cart Detail */}
        {showCart && (
          <div className="bg-gray-50 rounded p-2 max-h-40 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada item</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="py-1">{item.name}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Minus size={12} />
                          </button>
                          <span>{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="text-right">
                        Rp {(item.price * item.qty).toLocaleString()}
                      </td>
                      <td className="pl-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Payment */}
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Masukkan jumlah uang"
            value={payment}
            onChange={(e) => setPayment(parseInt(e.target.value) || 0)}
            className="border p-2 rounded w-full text-sm"
          />
          <div className="grid grid-cols-4 gap-2">
            {[2000, 5000, 10000, 20000, 50000, 100000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => addDenomination(val)}
                className="bg-gray-100 px-2 py-1 rounded text-xs"
              >
                +{val.toLocaleString()}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span>Total: Rp {total.toLocaleString()}</span>
            <span>
              Kembali:{" "}
              <span className="font-semibold text-green-600">
                Rp {change >= 0 ? change.toLocaleString() : 0}
              </span>
            </span>
          </div>
          <button
            onClick={handlePay}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
          >
            ✅ Bayar
          </button>
        </div>
      </div>
    </div>
  );
}

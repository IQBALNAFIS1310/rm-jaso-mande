import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Reviews({ user }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", comment: "", rating: 0 });
  const [average, setAverage] = useState(0);
  const [replyForm, setReplyForm] = useState({}); // simpan reply sementara per review

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    let { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setReviews(data);
      if (data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverage(avg);
      } else {
        setAverage(0);
      }
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (form.comment.length > 200) {
      alert("Komentar maksimal 200 karakter!");
      return;
    }
    const { error } = await supabase.from("reviews").insert([
      {
        name: form.name,
        comment: form.comment,
        rating: form.rating,
      },
    ]);
    if (error) {
      alert("Gagal mengirim review");
      console.error(error);
    } else {
      setForm({ name: "", comment: "", rating: 0 });
      fetchReviews();
    }
  };

  const submitReply = async (id) => {
    if (!replyForm[id]) return;
    const { error } = await supabase
      .from("reviews")
      .update({ reply: replyForm[id] })
      .eq("id", id);
    if (error) {
      alert("Gagal mengirim balasan");
      console.error(error);
    } else {
      setReplyForm({ ...replyForm, [id]: "" });
      fetchReviews();
    }
  };

  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">Ulasan Pengunjung</h2>

        {/* Rata-rata rating */}
        <div className="text-center mb-10">
          {reviews.length > 0 ? (
            <div>
              <div className="text-3xl text-yellow-400">
                {"★".repeat(Math.round(average))}
                {"☆".repeat(5 - Math.round(average))}
              </div>
              <p className="text-gray-600 mt-2">
                {average.toFixed(1)} dari 5 • {reviews.length} ulasan
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Belum ada ulasan</p>
          )}
        </div>

        {/* Form Review Pengunjung */}
        <form
          onSubmit={submitReview}
          className="bg-gray-50 p-6 rounded-lg shadow space-y-4 mb-10"
        >
          <input
            type="text"
            placeholder="Nama Anda"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-3 rounded"
            required
          />
          <textarea
            rows="3"
            placeholder="Tulis komentar (max 200 karakter)"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full border p-3 rounded"
            maxLength={200}
            required
          />
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className={`text-2xl ${star <= form.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
              >
                ★
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kirim Ulasan
          </button>
        </form>

        {/* List Review */}
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border p-4 rounded shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{r.name}</h3>
                <div className="text-yellow-400">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
              </div>
              <p className="text-gray-700 break-words whitespace-pre-wrap">
                {r.comment}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(r.created_at).toLocaleString("id-ID")}
              </p>

              {/* Reply dari admin */}
              {r.reply && (
                <div className="mt-3 p-3 bg-gray-100 rounded text-sm text-gray-800">
                  <strong>Admin:</strong> {r.reply}
                </div>
              )}

              {/* Form balas khusus admin */}
              {user?.role === "admin" && (
                <div className="mt-3">
                  <textarea
                    rows="2"
                    placeholder="Balas ulasan..."
                    value={replyForm[r.id] || ""}
                    onChange={(e) =>
                      setReplyForm({ ...replyForm, [r.id]: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                  <button
                    onClick={() => submitReply(r.id)}
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Kirim Balasan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

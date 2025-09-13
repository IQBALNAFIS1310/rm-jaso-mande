// src/components/ReviewsManager.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyForm, setReplyForm] = useState({});
  const [openReply, setOpenReply] = useState({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error.message);
    setReviews(data || []);
    setLoading(false);
  };

  const deleteReview = async (id) => {
    if (!confirm("Yakin hapus review ini?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (!error) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const submitReply = async (id) => {
    if (!replyForm[id]) return;
    const { error } = await supabase
      .from("reviews")
      .update({ reply: replyForm[id] })
      .eq("id", id);

    if (error) return alert("Gagal menyimpan balasan");

    // update state lokal tanpa fetch ulang
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, reply: replyForm[id] } : r
      )
    );
    setReplyForm((prev) => ({ ...prev, [id]: "" }));
    setOpenReply((prev) => ({ ...prev, [id]: false }));
  };

  const renderStars = (rating) =>
    "⭐".repeat(rating) + "☆".repeat(5 - rating);

  return (
<div className="p-4">
  <h2 className="text-xl font-bold mb-4">Kelola Review</h2>

  {loading ? (
    <p>Loading...</p>
  ) : reviews.length === 0 ? (
    <p className="text-gray-500 italic">Belum ada review</p>
  ) : (
    <>
      {/* 📱 Mobile: Card view */}
      <div className="space-y-4 md:hidden">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{r.name}</h3>
              <span className="text-yellow-500">{renderStars(r.rating)}</span>
            </div>
            <p className="text-gray-700 break-words">{r.comment}</p>
            <p className="text-xs text-gray-500">
              {new Date(r.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {/* Balasan */}
            {openReply[r.id] ? (
              <div className="space-y-2">
                <textarea
                  rows="2"
                  className="w-full border p-2 rounded"
                  placeholder="Tulis balasan..."
                  value={replyForm[r.id] ?? (r.reply || "")}
                  onChange={(e) =>
                    setReplyForm((prev) => ({
                      ...prev,
                      [r.id]: e.target.value,
                    }))
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => submitReply(r.id)}
                    className="flex-1 bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() =>
                      setOpenReply((prev) => ({ ...prev, [r.id]: false }))
                    }
                    className="flex-1 bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : r.reply ? (
              <div className="space-y-2">
                <div className="text-sm bg-gray-100 p-2 rounded">
                  <strong>Balasan:</strong> {r.reply}
                </div>
                <button
                  onClick={() =>
                    setOpenReply((prev) => ({ ...prev, [r.id]: true }))
                  }
                  className="w-full bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit Balasan
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  setOpenReply((prev) => ({ ...prev, [r.id]: true }))
                }
                className="w-full bg-blue-500 text-white px-2 py-1 rounded"
              >
                Reply
              </button>
            )}

            {/* Tombol hapus */}
            <button
              onClick={() => deleteReview(r.id)}
              className="w-full bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      {/* 💻 Desktop: Table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Komentar</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Balasan</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.name}</td>
                <td className="border p-2 break-words">{r.comment}</td>
                <td className="border p-2 text-yellow-500">
                  {renderStars(r.rating)}
                </td>
                <td className="border p-2">
                  {new Date(r.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="border p-2">
                  {openReply[r.id] ? (
                    <div className="space-y-2">
                      <textarea
                        rows="2"
                        className="w-full border p-2 rounded"
                        placeholder="Tulis balasan..."
                        value={replyForm[r.id] ?? (r.reply || "")}
                        onChange={(e) =>
                          setReplyForm((prev) => ({
                            ...prev,
                            [r.id]: e.target.value,
                          }))
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitReply(r.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() =>
                            setOpenReply((prev) => ({ ...prev, [r.id]: false }))
                          }
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : r.reply ? (
                    <div className="space-y-2">
                      <div className="text-sm bg-gray-100 p-2 rounded">
                        <strong>Balasan:</strong> {r.reply}
                      </div>
                      <button
                        onClick={() =>
                          setOpenReply((prev) => ({ ...prev, [r.id]: true }))
                        }
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setOpenReply((prev) => ({ ...prev, [r.id]: true }))
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Reply
                    </button>
                  )}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}
</div>
  );
}

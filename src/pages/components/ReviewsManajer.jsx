// src/components/ReviewsManager.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error.message);
    }
    setReviews(data || []);
    setLoading(false);
  };

  const deleteReview = async (id) => {
    if (!confirm("Yakin ingin menghapus review ini?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (!error) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      console.error("Gagal menghapus review:", error.message);
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Kelola Review</h2>

      {loading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada review</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Komentar</th>
                <th className="border p-2">Rating</th>
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td className="border p-2">{r.name}</td>
                  <td className="border p-2">{r.comment}</td>
                  <td className="border p-2 text-yellow-500">
                    {renderStars(r.rating)}
                  </td>
                  <td className="border p-2">
                    {new Date(r.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => deleteReview(r.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

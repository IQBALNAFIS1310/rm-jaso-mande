import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews(data || []);
  };

  const deleteReview = async (id) => {
    await supabase.from("reviews").delete().eq("id", id);
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Kelola Review</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Komentar</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(r => (
            <tr key={r.id}>
              <td className="border p-2">{r.name}</td>
              <td className="border p-2">{r.comment}</td>
              <td className="border p-2">{r.rating}</td>
              <td className="border p-2">
                <button onClick={() => deleteReview(r.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

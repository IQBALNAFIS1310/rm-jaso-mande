import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function MenuList() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .eq("is_visible", true) // hanya tampilkan menu yang visible
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Gagal fetch menu:", error.message);
    } else {
      setMenus(data);
    }
  };

  return (
    <section id="menu" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Menu Andalan</h2>

        {menus.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada menu</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition p-4"
              >
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">{menu.name}</h3>
                  <p className="text-gray-600 mt-1">{menu.description}</p>
                  <p className="text-blue-600 font-bold mt-2">
                    Rp {menu.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-5 gap-8">

        {/* Info */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            Rumah Makan Jaso Mande
          </h2>
          <p className="text-sm mb-2">
            Menyajikan makanan khas Minang dengan cita rasa asli.
            Menu andalan: Rendang, Ayam Bakar.
          </p>
          <p className="text-sm">Jl. Contoh No.123, Padang</p>
        </div>

        {/* Jam Operasional */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Jam Buka</h3>
          <ul className="text-sm space-y-1">
            <li>Senin - Jumat: 10.00 - 22.00</li>
            <li>Sabtu - Minggu: 09.00 - 23.00</li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Kontak</h3>
          <ul className="text-sm space-y-1">
            <li>📞 0812-3456-7890</li>
            <li>✉️ jasomande@email.com</li>
            <li>
              📍 <a href="https://maps.google.com" className="hover:text-white">
                Lihat di Google Maps
              </a>
            </li>
          </ul>
        </div>

        {/* Sosial Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Ikuti Kami</h3>
          <div className="flex gap-3 text-xl">
            <a href="#" className="hover:text-white">📘</a>
            <a href="#" className="hover:text-white">📸</a>
            <a href="#" className="hover:text-white">🎵</a>
          </div>
        </div>

        {/* Akun / Login */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Akun</h3>
          <ul className="text-sm space-y-1">
            <li>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Rumah Makan Jaso Mande. All rights reserved.
      </div>
    </footer>
  );
}

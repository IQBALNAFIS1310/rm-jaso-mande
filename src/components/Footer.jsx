export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* Info */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Rumah Makan Jaso Mande</h2>
          <p className="text-sm">
            Menyajikan makanan khas Minang dengan cita rasa asli.
            Menu andalan: Rendang, Ayam Bakar.
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Navigasi</h3>
          <ul className="space-y-2">
            <li><a href="#home" className="hover:text-white">Home</a></li>
            <li><a href="#menu" className="hover:text-white">Menu</a></li>
            <li><a href="#contact" className="hover:text-white">Kontak</a></li>
            <li><a href="#reviews" className="hover:text-white">Review</a></li>
            <li><a href="/login" className="hover:text-white">Masuk</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} Rumah Makan Jaso Mande. All rights reserved.
      </div>
    </footer>
  );
}

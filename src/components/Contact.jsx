export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Kontak Kami</h2>
        
        <div className="grid md:grid-cols-2 gap-10">
          {/* Info Kontak */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Informasi</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Alamat:</span> (Akan ditambahkan)
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Nomor:</span> -
            </p>
            <p className="text-gray-700">
              Kami siap melayani Anda setiap hari dengan menu khas Minang terbaik.
            </p>
          </div>

          {/* Form Kontak */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Kirim Pesan</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nama Anda"
                className="w-full border p-3 rounded"
              />
              <input
                type="email"
                placeholder="Email Anda"
                className="w-full border p-3 rounded"
              />
              <textarea
                rows="4"
                placeholder="Pesan..."
                className="w-full border p-3 rounded"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

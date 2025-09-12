import bgn from '../assets/bgn-lauk.jpg'

export default function Hero() {
  return (
    <section
      className="h-[80vh] flex flex-col justify-center items-center text-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgn})` }}
    >
      <div className="absolute inset-0"></div>
      <div className="relative z-10 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Rumah Makan Jaso Mande
        </h1>
        <p className="text-lg md:text-2xl mb-6">
          Rasa Tradisional, Cita Rasa Minang
        </p>
        <a
          href="#menu"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg shadow"
        >
          Lihat Menu
        </a>
      </div>
    </section>
  );
}

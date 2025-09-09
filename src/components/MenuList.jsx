const menus = [
  {
    name: "Rendang",
    description: "Daging sapi dimasak dengan rempah khas Minang, cita rasa gurih dan pedas.",
    price: "Rp 35.000",
    image: "https://i.pinimg.com/1200x/06/86/8d/06868d0d342290434ac1d00586cdbab9.jpg"
  },
  {
    name: "Ayam Bakar",
    description: "Ayam bakar dengan bumbu tradisional, disajikan dengan sambal dan lalapan.",
    price: "Rp 25.000",
    image: "https://i.pinimg.com/1200x/2e/7b/7e/2e7b7e620090b62149b8c1aeb92dcf08.jpg"
  }
];

export default function MenuList() {
  return (
    <section id="menu" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Menu Andalan</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menus.map((menu, index) => (
            <div
              key={index}
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
                <p className="text-blue-600 font-bold mt-2">{menu.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

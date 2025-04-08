import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center px-4 lg:px-16"
      style={{ backgroundImage: "url('/assets/background.jpg')" }} // ← usa aquí tu imagen
    >
      <div className="bg-[#2e5ca6]/90 shadow-xl rounded-3xl w-full max-w-6xl py-12 px-6 lg:px-12 transition-all duration-300">
        <div className="text-left">
          <h1 className="text-4xl font-bold text-white mb-8">Sobre Nosotros</h1>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <p className="text-lg text-[#e5eff5] leading-relaxed">
              Somos una comunidad comprometida con el desarrollo de la tecnología...
            </p>

            <div className="flex justify-center lg:justify-end">
              <img
                src="/assets/logo-temscon.png"
                alt="Logo TEMSCON LATAM"
                className="w-[180px] h-auto bg-white p-4 rounded-xl shadow-md"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mt-12">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Nuestra Misión</h2>
              <p className="text-[#e5eff5] text-lg leading-relaxed">
                Fomentar la educación, innovación y colaboración...
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Nuestra Visión</h2>
              <p className="text-[#e5eff5] text-lg leading-relaxed">
                Ser el principal evento en América Latina...
              </p>
            </div>
          </div>

          <div className="mt-10 text-center lg:text-left">
            <Link
              to="https://attend.ieee.org/temscon-latam/"
              className="bg-white text-[#0073AE] font-semibold py-3 px-6 rounded-full hover:bg-[#005f95] hover:text-white transition-all duration-300 shadow"
            >
              Contacta con nosotros
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

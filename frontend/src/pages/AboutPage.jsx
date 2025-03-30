import { Link } from "react-router-dom";
import { useEffect } from "react";

function AboutPage() {
  useEffect(() => {
    document.body.classList.add("about-page");

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <div className="bg-[#dff2fe] py-12 items-center justify-center mt-10 ">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-[#327CA0] mb-6">
          Sobre Nosotros
        </h1>

        <p className="text-xl text-black mb-8 ">
          Somos una comunidad comprometida con el desarrollo de la tecnología y
          la innovación. En TEMSCON LATAM, buscamos crear espacios para el
          intercambio de conocimientos y experiencias entre los líderes y
          profesionales del sector tecnológico de América Latina.
        </p>

        <div className="mb-8">
          <img
            src="/assets/logo-temscon.png"
            alt="Logo TEMSCON LATAM"
            className="mx-auto max-w-[200px] h-auto"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-[#327CA0] mb-4">
              Nuestra Misión
            </h2>
            <p className="text-black text-lg">
              Nuestra misión es fomentar la educación, la innovación y la
              colaboración en tecnología a través de conferencias, talleres y
              eventos interactivos que conecten a los participantes con la
              última información del sector.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#327CA0] mb-4">
              Nuestra Visión
            </h2>
            <p className="text-black text-lg">
              Ser el principal evento en América Latina para estudiantes y
              profesionales interesados en las últimas tendencias en tecnología,
              creando una plataforma inclusiva para compartir ideas y crear
              redes de trabajo.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="https://attend.ieee.org/temscon-latam/"
            className="bg-white text-[#0073AE] font-medium py-2 px-6 rounded-lg border-2 border-[#0073AE] hover:bg-[#f0f0f0] hover:border-[#005b7f] text-lg mb-4"
          >
            Contacta con nosotros
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

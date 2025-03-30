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
    <div className="flex justify-center items-center bg-cover bg-center">
    <div className="bg-[#2e5ca6] bg-opacity-85 shadow-lg rounded-lg w-full max-w-[900px] min-h-[83vh] h-auto py-12 px-6 flex flex-col items-center justify-center mt-4"> 
      <div className="max-w-7xl text-center">
        <h1 className="text-4xl font-bold text-[#ffffff] mb-6">Sobre Nosotros</h1>

        <p className="text-xl text-[#ffffff] mb-8">
          Somos una comunidad comprometida con el desarrollo de la tecnología y
          la innovación. En TEMSCON LATAM, buscamos crear espacios para el
          intercambio de conocimientos y experiencias entre los líderes y
          profesionales del sector tecnológico de América Latina.
        </p>

        <div className="mb-6 bg-[#ffffff] mx-80 ">
          <img
            src="/assets/logo-temscon.png"
            alt="Logo TEMSCON LATAM"
            className="mx-auto max-w-[210px] h-auto "
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-[#ffffff] mb-4">Nuestra Misión</h2>
            <p className="text-[#ffffff] text-lg">
              Nuestra misión es fomentar la educación, la innovación y la
              colaboración en tecnología a través de conferencias, talleres y
              eventos interactivos que conecten a los participantes con la
              última información del sector.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#ffffff] mb-4">Nuestra Visión</h2>
            <p className="text-[#ffffff] text-lg">
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
            className="bg-[#ffffff] hover:bg-[#0073ae] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] "
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

import { useAuth } from "../context/AuthContext";

function HomePage() {
  // eslint-disable-next-line no-unused-vars
  const data = useAuth();
  //? console.log(data);

  return <div>HomePage</div>;
}

export default HomePage;

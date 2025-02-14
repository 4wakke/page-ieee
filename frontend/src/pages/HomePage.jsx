import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui";

function HomePage() {
  // eslint-disable-next-line no-unused-vars
  const data = useAuth();
  //? console.log(data);

  return (
    <div>
      <Card>
        <h1 className="Text-3xl font-bold my-4">Home Page</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque ex
          fugiat eos reprehenderit nisi amet, tempora tempore, optio hic ipsam,
          magni praesentium dolorum voluptatem? Accusantium atque nihil vel
          labore illo, laboriosam voluptas, distinctio nam nulla sequi eum amet
          doloremque cumque?
        </p>
      </Card>
      
    </div>
  );
}

export default HomePage;

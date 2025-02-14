import { Link } from "react-router-dom";
import { Card } from "../components/ui";

function NotFound() {
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <Card>
        <h1 className="text-4xl font-bold my-2"> Page Not Found</h1>
        <h3 className="text-2xl">404</h3>

        <Link to="/" className="font-bold text-gray-100">
          Go back to home, CLICK HERE
        </Link>
      </Card>
    </div>
  );
}

export default NotFound;

import { Card, Input, Button, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const response = await axios.post(
      "http://localhost:3000/api/signin",
      data,
      {
        withCredentials: true,
      }
    );
    console.log(response);
  });

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <Card>
        <h1 className="text-4xl font-bold my-2 text-center">Sign in</h1>

        <form onSubmit={onSubmit}>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: true,
            })}
          />

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: true,
            })}
          />

          <Button>Sign in</Button>

          <div className="flex justify-between my-4">
            <p>Do not have an account?</p>
            <Link to="/register" className="font-bold ">
              Register
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;

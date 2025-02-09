import { Input, Button, Card, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const response = await axios.post(
      "http://localhost:3000/api/signup",
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
        <h3 className="text-2xl font-bold">RegisterPage</h3>

        <form onSubmit={onSubmit}>
          <Label htmlFor="name">Fullname</Label>
          <Input
            placeholder="Enter your fullname "
            {...register("name", { required: true })}
          />

          {errors.name && <p className="text-red-700">name is required</p>}

          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Enter your email "
            {...register("email", { required: true })}
          />

          {errors.email && <p className="text-red-700">email is required</p>}

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Enter your password "
            {...register("password", { required: true })}
          />

          {errors.password && (
            <p className="text-red-700">password is required</p>
          )}

          <Button>Register</Button>

          <div className="flex justify-between my-4">
            <p>Already have an account?</p>
            <Link to="/login" className="font-bold ">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;

import { Card, Input, Button, Label, Container } from "../components/ui";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: loginErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);

    if (user) {
      navigate("/profile");
    }
  });

  return (
    <Container className="h-[calc(100vh-10rem)] flex items-center justify-center">
      <Card>
        {loginErrors &&
          loginErrors.map((err) => (
            // eslint-disable-next-line react/jsx-key
            <p className="text-red-500 font-bold"> {err}</p>
          ))}

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

          {errors.email && <p className="text-red-700">Email is required</p>}

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: true,
            })}
          />

          {errors.password && (
            <p className="text-red-700">Password is required</p>
          )}

          <Button>Sign in</Button>

          <div className="flex justify-between my-4">
            <p className="mr-4">Do not have an account?</p>
            <Link to="/register" className="font-bold ">
              Register
            </Link>
          </div>
        </form>
      </Card>
    </Container>
  );
}

export default LoginPage;

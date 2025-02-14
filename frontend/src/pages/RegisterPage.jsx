import { Input, Button, Card, Label, Container } from "../components/ui";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, errors: signupErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signup(data);

    if (user) {
      navigate("/profile");
    }
  });

  return (
    <Container className="h-[calc(100vh-10rem)] flex items-center justify-center">
      <Card>
        {signupErrors &&
          signupErrors.map((err) => (
            // eslint-disable-next-line react/jsx-key
            <p className="text-red-500 font-bold"> {err}</p>
          ))}

        <h3 className="text-3xl font-bold text-center">Register</h3>
        <form onSubmit={onSubmit}>
          <Label htmlFor="name">Name</Label>
          <Input
            placeholder="Enter your fullname "
            {...register("name", { required: true })}
          />

          {errors.name && <p className="text-red-700">Name is required</p>}

          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Enter your email "
            {...register("email", { required: true })}
          />

          {errors.email && <p className="text-red-700">Email is required</p>}

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Enter your password "
            {...register("password", { required: true })}
          />

          {errors.password && (
            <p className="text-red-700">Password is required</p>
          )}

          <Button>Register</Button>

          <div className="flex justify-between my-4">
            <p className="mr-4">Already have an account?</p>
            <Link to="/login" className="font-bold ">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </Container>
  );
}

export default RegisterPage;

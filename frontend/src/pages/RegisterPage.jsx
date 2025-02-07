function RegisterPage() {
  return (
    <div>
      <h3 className="text-2xl font-bold">RegisterPage</h3>
      <form>
        <input type="text" placeholder="Enter your fullname" />
        <input type="email" placeholder="Enter your email" />
        <input type="password" placeholder="Enter your password" />
        <button>Register</button>
      </form>
    </div>
  );
}


export default RegisterPage;

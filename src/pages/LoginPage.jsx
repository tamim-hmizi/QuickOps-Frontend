import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser({ email, password });
      if (!user.active) {
        toast.error("Account is not active.");
        return;
      }
      dispatch(login(user));
      toast.success("Logged in!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-box p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-white">QO</span>
          </div>
          <h1 className="text-2xl font-bold text-center">
            <span className="text-primary">Quick</span>Ops
          </h1>
        </div>
        <h2 className="text-center text-xl font-semibold mb-4">Welcome back</h2>
        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <div className="form-control w-full">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control w-full">
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

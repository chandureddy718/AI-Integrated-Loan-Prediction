import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      setMessage("Login Failed ✘");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          fullname: decoded.name,
          email: decoded.email,
        }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      setMessage("Google Login Failed ✘");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4"
    >
      {/* CARD */}
      <div
        className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl
        bg-white/10 backdrop-blur-xl border border-white/20
        shadow-2xl overflow-hidden"
      >
        {/* LEFT – FORM */}
        <div className="p-8 text-white">
          <h2 className="text-3xl font-extrabold mb-2">Welcome Back</h2>
          <p className="text-slate-300 mb-6">
            Login to continue to LoanPredict
          </p>

          {message && (
            <p className="text-red-400 text-sm mb-4">{message}</p>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <label className="text-sm">Email</label>
            <input
              type="email"
              className="w-full mt-1 mb-4 px-4 py-2 rounded-lg
              bg-white/20 border border-white/30
              focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* PASSWORD */}
            <label className="text-sm">Password</label>
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 px-4 py-2 rounded-lg pr-12
                bg-white/20 border border-white/30
                focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-sm cursor-pointer text-cyan-300"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-full font-semibold
              bg-cyan-400 text-slate-900 hover:bg-cyan-300 transition"
            >
              Sign in
            </button>
          </form>

          {/* GOOGLE */}
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setMessage("Google Login Failed ✘")}
            />
          </div>

          <p className="text-center text-sm text-slate-300 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-cyan-400 font-medium">
              Register
            </Link>
          </p>
        </div>

        {/* RIGHT – IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-white">
          <img
            src="/images/login-art.png"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

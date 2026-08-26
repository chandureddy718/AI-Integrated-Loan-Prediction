import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        fullname,
        email,
        password,
      });
      setMessage("Registration Successful ✔");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration Failed ✘");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 px-4"
    >
      {/* MAIN CARD */}
      <div
        className="w-full max-w-4xl min-h-[560px]
        grid md:grid-cols-[0.85fr_1.15fr]
        rounded-2xl bg-white/10 backdrop-blur-xl
        border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* LEFT – IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-black/25 p-6">
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-black/40">
            <img
              src="/images/register-art.jpg"
              alt="Register Visual"
              className="w-full h-full object-contain"
            />

            {/* TEXT */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white">
                LoanPredict
              </h3>
              <p className="text-slate-300 text-sm">
                Smart loans start with smart decisions.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT – FORM */}
        <div className="p-10 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold mb-2">
            Create an account
          </h2>

          <p className="text-slate-300 mb-6">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 font-medium">
              Login
            </Link>
          </p>

          {message && (
            <p
              className={`text-sm mb-4 ${
                message.includes("Successful")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-4 px-4 py-3 rounded-lg
              bg-white/20 border border-white/30
              placeholder-slate-300
              focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-3 rounded-lg
              bg-white/20 border border-white/30
              placeholder-slate-300
              focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-5 px-4 py-3 rounded-lg
              bg-white/20 border border-white/30
              placeholder-slate-300
              focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* TERMS */}
            <div className="flex items-center gap-2 mb-6 text-sm text-slate-300">
              <input type="checkbox" required />
              <span>
                I agree to the{" "}
                <span className="text-cyan-400">Terms & Conditions</span>
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold
              bg-purple-500 hover:bg-purple-400 transition"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

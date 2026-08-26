import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
      ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-slate-900/40 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`text-2xl font-bold transition-colors ${
            scrolled ? "text-blue-600" : "text-white"
          }`}
        >
          LoanPredict
        </Link>

        {/* LINKS */}
        <div
          className={`flex gap-6 items-center font-medium transition-colors
          ${scrolled ? "text-gray-700" : "text-white"}`}
        >
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-blue-600 transition"
          >
            Home
          </Link>

          <a href="#about" className="hover:text-blue-600 transition">
            About
          </a>

          <Link to="/loan-form" className="hover:text-blue-600 transition">
            Apply Loan
          </Link>

          {/* ✅ EMI CALCULATOR LINK */}
          <Link to="/emi-calculator" className="hover:text-blue-600 transition">
            EMI Calculator
          </Link>

          <Link to="/prediction" className="hover:text-blue-600 transition">
            Predictions
          </Link>

          <a href="#how" className="hover:text-blue-600 transition">
            How it Works
          </a>

          <a href="#contact" className="hover:text-blue-600 transition">
            Contact
          </a>

          {token && (
            <Link to="/history" className="hover:text-blue-600 transition">
              History
            </Link>
          )}

          {!token ? (
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="text-red-500 font-semibold hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

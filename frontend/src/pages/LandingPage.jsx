import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen pt-32 flex flex-col justify-center items-center
      bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white px-6 relative overflow-hidden"
    >
      {/* Hero Section */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center leading-tight">
        Know Your <span className="text-cyan-400">Loan Potential</span>
      </h1>

      <p className="mt-6 text-slate-300 text-center max-w-2xl text-lg">
        Get an instant eligibility prediction for personal loans in seconds.
        No hidden requirements, no waiting.
      </p>

      {/* Action Buttons */}
      <div className="mt-10 flex gap-6 flex-wrap justify-center">
        <button
          onClick={() => navigate("/loan-form")}
          className="px-8 py-3 rounded-full bg-cyan-400 text-slate-900
            font-semibold shadow-lg hover:shadow-cyan-400/40
            hover:-translate-y-0.5 transition-all"
        >
          Apply Loan
        </button>

        <button
          onClick={() => navigate("/emi-calculator")}
          className="px-8 py-3 rounded-full bg-blue-600 text-white
            font-semibold shadow-lg hover:bg-blue-700
            hover:-translate-y-0.5 transition-all"
        >
          Calculate EMI
        </button>

        <button
          onClick={() => navigate("/prediction")}
          className="px-8 py-3 rounded-full border-2 border-white text-white
            font-semibold hover:bg-white hover:text-slate-900
            hover:-translate-y-0.5 transition-all"
        >
          View Prediction
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-20 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-slate-400">Get eligibility prediction in seconds</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-slate-400">Your data is encrypted and safe</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
            <p className="text-slate-400">Machine learning based predictions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
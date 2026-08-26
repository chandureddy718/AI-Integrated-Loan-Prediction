import { useState } from "react";
import LoanForm from "../components/LoanForm";
import EMICalculator from "../components/EMICalculator";

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <>
      {/* ================= HERO ================= */}
      <section
        className="min-h-screen pt-32 flex flex-col justify-center items-center
        bg-gradient-to-br from-yellow-50 via-orange-100 to-amber-200
        text-gray-800 px-6 relative overflow-hidden"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-center leading-tight">
          Know Your <span className="text-orange-500">Loan Potential</span>
        </h1>

        <p className="mt-6 text-gray-600 text-center max-w-2xl text-lg">
          Get an instant eligibility prediction for personal loans in seconds.
          No hidden requirements, no waiting.
        </p>

        <div className="mt-10">
          <a
            href="#about"
            className="px-8 py-3 rounded-full bg-orange-400 text-white
            font-semibold shadow-lg hover:bg-orange-500
            hover:-translate-y-0.5 transition-all"
          >
            Explore LoanPredict
          </a>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="py-24 bg-yellow-50 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              About <span className="text-orange-500">LoanPredict</span>
            </h2>

            <p className="text-gray-600 mb-4">
              LoanPredict is an AI-powered loan eligibility prediction system that
              helps users understand their approval chances before applying.
            </p>

            <p className="text-gray-600 mb-6">
              It leverages Machine Learning models trained on historical loan
              data to deliver fast, accurate, and transparent decisions.
            </p>

            <ul className="space-y-2 text-sm text-gray-700">
              <li>✔ MERN Stack + Python ML</li>
              <li>✔ No credit score impact</li>
              <li>✔ Instant eligibility result</li>
              <li>✔ User friendly UI</li>
            </ul>

            <div className="mt-6">
              <a
                href="#loan"
                className="inline-block px-6 py-2 rounded-full
                bg-orange-500 text-white font-semibold
                hover:bg-orange-600 transition"
              >
                Check Eligibility
              </a>
            </div>
          </div>

          <div>
            <img
              src="/images/image.jpg"
              alt="Loan flow"
              className="w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* ================= CHECK ELIGIBILITY ================= */}
      <section id="loan" className="py-24 px-6 bg-amber-50 flex justify-center">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12">
          <LoanForm onResult={setResult} />

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Demo Flow</h2>

            <ol className="space-y-3 text-sm text-gray-700">
              <li>1. Enter loan details</li>
              <li>2. Submit the form</li>
              <li>3. Backend sends data to ML model</li>
              <li>4. Model predicts eligibility</li>
              <li>5. Result shown instantly</li>
            </ol>

            {!result && (
              <p className="text-gray-500">
                Submit the form to see your eligibility result.
              </p>
            )}

            {result && (
              <div
                className={`p-6 rounded-xl border ${
                  result === "Approved"
                    ? "bg-green-50 border-green-300"
                    : "bg-red-50 border-red-300"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">
                  {result === "Approved" ? "✅ Approved" : "❌ Rejected"}
                </h3>

                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {result === "Approved" ? (
                    <>
                      <li>Maintain good credit history</li>
                      <li>Avoid missed EMIs</li>
                      <li>Keep income stable</li>
                    </>
                  ) : (
                    <>
                      <li>Improve credit score</li>
                      <li>Reduce loan amount</li>
                      <li>Clear existing debts</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= EMI ================= */}
      <section id="calculator" className="py-24 px-6 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            EMI Calculator
          </h2>

          <p className="text-center text-gray-600 mb-12">
            Calculate your monthly EMI easily.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white border rounded-2xl p-8">
              <EMICalculator />
            </div>

            <div className="flex justify-center">
              <img
                src="/images/emi-dummy.png"
                alt="EMI"
                className="max-w-sm w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
<section id="contact" className="py-28 bg-amber-50 px-6">
  <h2 className="text-3xl font-bold text-center mb-4">
    Contact Our Team
  </h2>

  <p className="text-center text-gray-600 max-w-2xl mx-auto mb-14">
    Meet the team behind{" "}
    <span className="font-semibold text-orange-500">LoanPredict</span>,
    a project built with teamwork and innovation.
  </p>

  <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8">
    {[
      {
        name: "Priya Darshini",
        role: "Project Lead",
        tag: "Architecture & Vision",
        email: "priya@gmail.com",
      },
      {
        name: "Siri Chandana",
        role: "ML Engineer",
        tag: "Model Training & Accuracy",
        email: "sirichandana@gmail.com",
      },
      {
        name: "Gangotri",
        role: "Frontend Developer",
        tag: "UI & UX Design",
        email: "gangotri@gmail.com",
      },
      {
        name: "Jahnavi",
        role: "Backend Developer",
        tag: "API & Integration",
        email: "jahnavi@gmail.com",
      },
    ].map((m, i) => (
      <div
        key={i}
        className="bg-white border border-slate-200 rounded-2xl p-6 text-center
        hover:shadow-xl hover:-translate-y-1 transition-all"
      >
        <div
          className="h-14 w-14 mx-auto mb-4 rounded-full bg-orange-100
          flex items-center justify-center text-orange-600 font-bold text-lg"
        >
          {m.name.charAt(0)}
        </div>

        <h3 className="font-bold text-gray-900">{m.name}</h3>
        <p className="text-orange-600 text-sm font-medium">{m.role}</p>
        <p className="mt-2 text-xs text-gray-500">{m.tag}</p>

        {/* EMAIL */}
        <a
          href={`mailto:${m.email}`}
          className="block mt-2 text-xs text-blue-600 hover:underline"
        >
          {m.email}
        </a>
      </div>
    ))}
  </div>
</section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-amber-900 text-white px-6 py-10 text-center">
        © {new Date().getFullYear()} LoanPredict
      </footer>
    </>
  );
}
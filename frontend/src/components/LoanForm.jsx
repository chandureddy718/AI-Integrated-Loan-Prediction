import { useState } from "react";
import axios from "axios";
import EligibilityMeter from "./EligibilityMeter";

export default function LoanForm({ onResult }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    gender: 1,
    married: 1,
    dependents: 0,
    education: 1,
    self_employed: 0,
    applicant_income: "",
    coapplicant_income: "",
    loan_amount: "",
    loan_amount_term: 360,
    credit_history: 1,
    property_area: 2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        gender: form.gender == 1 ? "Male" : "Female",
        married: form.married == 1 ? "Yes" : "No",
        dependents: String(form.dependents),

        education: form.education == 1 ? "Graduate" : "Not Graduate",
        self_employed: form.self_employed == 1 ? "Yes" : "No",

        applicant_income: Number(form.applicant_income),
        coapplicant_income: Number(form.coapplicant_income || 0),

        loan_amount: Number(form.loan_amount),
        loan_amount_term: Number(form.loan_amount_term),

        credit_history: Number(form.credit_history),

        property_area:
          form.property_area == 2
            ? "Urban"
            : form.property_area == 1
            ? "Semiurban"
            : "Rural",
      };

      const res = await axios.post(
        "http://localhost:5000/api/loan/predict",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onResult(res.data.prediction);
    } catch (err) {
      console.error("Prediction Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Prediction failed";
      alert("Prediction failed: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // score 0 nunchi start avvali
  const roughScore =
    (Number(form.applicant_income || 0) / 100000) * 30 +
    (Number(form.coapplicant_income || 0) / 100000) * 10 +
    (form.credit_history === 1 || form.credit_history === "1" ? 40 : 10) +
    (form.property_area === 2 || form.property_area === "2" ? 20 : 10);

  const clampScore = Math.max(
    0,
    Math.min(100, isNaN(roughScore) ? 0 : Math.round(roughScore))
  );

  return (
    <div className="w-full">
      <div className="relative bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 overflow-hidden">
        {/* soft background gradient at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-50 via-white to-transparent" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start">
          {/* LEFT: FORM */}
          <form onSubmit={handleSubmit} className="space-y-5 text-slate-900">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">
                Loan Eligibility Assessment
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in your profile and let the AI engine estimate your
                approval chances.
              </p>
            </div>

            {/* gender + marital + dependents */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Gender
                </label>
                <select
                  name="gender"
                  onChange={handleChange}
                  defaultValue={form.gender}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Marital Status
                </label>
                <select
                  name="married"
                  onChange={handleChange}
                  defaultValue={form.married}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>Married</option>
                  <option value={0}>Single</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Dependents
                </label>
                <select
                  name="dependents"
                  onChange={handleChange}
                  defaultValue={form.dependents}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3+</option>
                </select>
              </div>
            </div>

            {/* education + employment */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Education
                </label>
                <select
                  name="education"
                  onChange={handleChange}
                  defaultValue={form.education}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>Graduate</option>
                  <option value={0}>Not Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Employment Type
                </label>
                <select
                  name="self_employed"
                  onChange={handleChange}
                  defaultValue={form.self_employed}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value={0}>Not Self Employed</option>
                  <option value={1}>Self Employed</option>
                </select>
              </div>
            </div>

            {/* income row */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Applicant Income
                </label>
                <input
                  type="number"
                  name="applicant_income"
                  onChange={handleChange}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 50000"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Co-applicant Income
                </label>
                <input
                  type="number"
                  name="coapplicant_income"
                  onChange={handleChange}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="optional"
                />
              </div>
            </div>

            {/* loan amount + term */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Loan Amount
                </label>
                <input
                  type="number"
                  name="loan_amount"
                  onChange={handleChange}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 300000"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Loan Term
                </label>
                <select
                  name="loan_amount_term"
                  onChange={handleChange}
                  defaultValue={form.loan_amount_term}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value={360}>30 Years</option>
                  <option value={240}>20 Years</option>
                  <option value={180}>15 Years</option>
                </select>
              </div>
            </div>

            {/* credit + property */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Credit History
                </label>
                <select
                  name="credit_history"
                  onChange={handleChange}
                  defaultValue={form.credit_history}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>Good Credit</option>
                  <option value={0}>Bad Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">
                  Property Area
                </label>
                <select
                  name="property_area"
                  onChange={handleChange}
                  defaultValue={form.property_area}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value={2}>Urban</option>
                  <option value={1}>Semiurban</option>
                  <option value={0}>Rural</option>
                </select>
              </div>
            </div>

            <button
              className="mt-2 w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              disabled={loading}
            >
              {loading ? "Checking..." : "Get Eligibility"}
            </button>
          </form>

          {/* RIGHT: ELIGIBILITY METER */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <EligibilityMeter score={clampScore} />

            <p className="mt-4 text-xs text-slate-500 text-center max-w-xs">
              This visual meter is only an approximate indicator based on your
              inputs. Final result is provided by the trained ML model.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

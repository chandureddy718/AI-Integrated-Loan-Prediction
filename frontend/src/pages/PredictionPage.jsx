import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PredictionPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/loan/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPredictions(res.data);
      } catch (err) {
        console.error("Error fetching predictions:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchPredictions();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading predictions...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login to view your prediction history.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Your Predictions</h2>
          <p className="mt-2 text-gray-600">
            View your past loan eligibility predictions
          </p>
        </div>

        {predictions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No Predictions Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't made any loan eligibility predictions yet.
            </p>
            <button
              onClick={() => navigate("/loan-form")}
              className="px-6 py-2 bg-cyan-400 text-slate-900 rounded-lg font-semibold hover:bg-cyan-500 transition"
            >
              Check Eligibility
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {predictions.map((pred, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Prediction #{predictions.length - index}
                    </h4>
                    <div className="space-y-1 text-gray-600 text-sm">
                      <p>Applicant Income: ₹{pred.inputData?.applicant_income || 'N/A'}</p>
                      <p>Co-applicant Income: ₹{pred.inputData?.coapplicant_income || 0}</p>
                      <p>Loan Amount: ₹{pred.inputData?.loan_amount || 'N/A'}</p>
                      <p>Loan Term: {pred.inputData?.loan_amount_term || 'N/A'} months</p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-semibold ${
                      pred.result === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {pred.result === "Approved" ? "✓ Eligible" : "✗ Not Eligible"}
                  </div>
                </div>
                {pred.result && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Result:</span>{" "}
                      {pred.result === "Approved" ? "Approved - High chance of loan approval" : "Rejected - Low chance of approval"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
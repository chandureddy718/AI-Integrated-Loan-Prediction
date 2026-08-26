import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/loan/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Set history directly from response array
        setHistory(res.data || []);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p className="p-10">Loading history...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">My Loan Check History</h1>

      {history.length === 0 ? (
        <p>No loan history found</p>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded shadow bg-white"
            >
              <p>
                <b>Result:</b>{" "}
                <span
                  className={
                    item.result === "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {item.result}
                </span>
              </p>

              <p>
                <b>Income:</b> {item.inputData.applicant_income}
              </p>

              <p>
                <b>Loan:</b> {item.inputData.loan_amount}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

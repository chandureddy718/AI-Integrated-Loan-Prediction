export default function PredictionInsight({ result }) {
  const isApproved = result === "Approved";

  return (
    <div
      className={`p-6 rounded-xl shadow-md border ${
        isApproved
          ? "bg-green-50 border-green-300"
          : "bg-red-50 border-red-300"
      }`}
    >
      {/* RESULT */}
      <h3
        className={`text-xl font-bold mb-2 ${
          isApproved ? "text-green-700" : "text-red-700"
        }`}
      >
        Prediction Result
      </h3>

      <p className="text-lg font-semibold mb-4">
        {isApproved ? "✅ Approved" : "❌ Rejected"}
      </p>

      {/* SUGGESTIONS */}
      <div>
        <h4 className="font-bold mb-2">
          {isApproved
            ? "👍 Suggestions to Maintain Eligibility"
            : "⚠️ Suggestions to Improve Eligibility"}
        </h4>

        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {isApproved ? (
            <>
              <li>Maintain good credit history</li>
              <li>Avoid missing EMIs or bill payments</li>
              <li>Do not overuse credit limits</li>
              <li>Keep income and employment stable</li>
            </>
          ) : (
            <>
              <li>Try to improve your credit score</li>
              <li>Reduce loan amount or increase income</li>
              <li>Clear existing debts if any</li>
              <li>Maintain stable employment for longer duration</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

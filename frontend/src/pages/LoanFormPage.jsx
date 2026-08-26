import { useState } from "react";
import LoanForm from "../components/LoanForm";

export default function LoanFormPage() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen pt-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Loan Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Apply for Loan</h2>
            <LoanForm onResult={setResult} />
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">How It Works</h3>
            
            <ol className="space-y-4 text-gray-700">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="font-semibold">Enter Loan Details</p>
                  <p className="text-sm text-gray-500">Fill in your income, loan amount, and other details</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="font-semibold">Submit the Form</p>
                  <p className="text-sm text-gray-500">Send your details to our ML model for evaluation</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="font-semibold">Get Instant Result</p>
                  <p className="text-sm text-gray-500">Receive your eligibility prediction with suggestions</p>
                </div>
              </li>
            </ol>

            {!result && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 Tip: Have your income details and credit history ready for accurate predictions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
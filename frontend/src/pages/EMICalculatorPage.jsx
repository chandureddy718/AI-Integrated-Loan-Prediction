import EMICalculator from "../components/EMICalculator";

export default function EMICalculatorPage() {
  return (
    <div className="min-h-screen pt-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">EMI Calculator</h2>
          <p className="mt-2 text-gray-600">
            Calculate your monthly EMI for any loan amount
          </p>
        </div>
        
        <EMICalculator />

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-bold text-lg mb-2">Principal Amount</h4>
            <p className="text-gray-600 text-sm">
              The original loan amount you borrow from the lender.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-bold text-lg mb-2">Interest Rate</h4>
            <p className="text-gray-600 text-sm">
              The rate at which the lender charges interest on the loan.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-bold text-lg mb-2">Loan Tenure</h4>
            <p className="text-gray-600 text-sm">
              The duration for which you will repay the loan EMIs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function EMICalculator() {
  // Form inputs
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  
  // Results
  const [emiResult, setEmiResult] = useState(null);
  const [schedule, setSchedule] = useState([]);
  
  // UI states
  const [showDetails, setShowDetails] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  // Calculate EMI using the standard formula
  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const n = parseFloat(tenure);

    if (!P || !annualRate || !n || P <= 0 || annualRate <= 0 || n <= 0) {
      alert("Please enter valid positive values for all fields");
      return;
    }

    const r = annualRate / 12 / 100; // Monthly interest rate
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Generate amortization schedule
    const scheduleData = [];
    let balance = P;

    for (let month = 1; month <= n; month++) {
      const interestPayment = balance * r;
      const principalPayment = emi - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      scheduleData.push({
        month,
        emi: emi,
        interest: interestPayment,
        principal: principalPayment,
        balance: balance
      });
    }

    setEmiResult({
      emi: emi.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      loanAmount: P,
      interestRate: annualRate,
      tenure: n
    });
    setSchedule(scheduleData);
    setShowDetails(false);
    setIsCalculated(true);
  };

  // Generate and download PDF - Simple and reliable
  const downloadPDF = () => {
    if (!emiResult || schedule.length === 0) {
      alert("Please calculate EMI first");
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(22);
      doc.setTextColor(0, 100, 0);
      doc.text("LoanPredict - EMI Report", 105, 20, { align: "center" });
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });

      // Line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 32, 190, 32);

      // Loan Summary Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Loan Summary", 20, 45);
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      const summaryY = 55;
      doc.text(`Loan Amount:        Rs. ${Number(emiResult.loanAmount).toLocaleString()}`, 20, summaryY);
      doc.text(`Interest Rate:       ${emiResult.interestRate}% per annum`, 20, summaryY + 8);
      doc.text(`Loan Tenure:         ${emiResult.tenure} months`, 20, summaryY + 16);

      // EMI Details Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("EMI Details", 20, summaryY + 35);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 100, 0);
      doc.text(`Monthly EMI:         Rs. ${Number(emiResult.emi).toLocaleString()}`, 20, summaryY + 45);
      
      doc.setTextColor(200, 100, 0);
      doc.text(`Total Interest:      Rs. ${Number(emiResult.totalInterest).toLocaleString()}`, 20, summaryY + 53);
      
      doc.setTextColor(100, 0, 150);
      doc.text(`Total Payable:       Rs. ${Number(emiResult.totalPayment).toLocaleString()}`, 20, summaryY + 61);

      // Monthly Payment Schedule
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Monthly Payment Schedule", 20, summaryY + 80);

      // Table header
      const tableStartY = summaryY + 90;
      doc.setFillColor(41, 128, 185);
      doc.rect(20, tableStartY, 170, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Month", 22, tableStartY + 5.5);
      doc.text("EMI", 55, tableStartY + 5.5);
      doc.text("Interest", 90, tableStartY + 5.5);
      doc.text("Principal", 125, tableStartY + 5.5);
      doc.text("Balance", 160, tableStartY + 5.5);

      // Table rows
      doc.setTextColor(0, 0, 0);
      let currentY = tableStartY + 10;
      
      // Show max 24 rows in PDF to avoid too long document
      const maxRows = Math.min(schedule.length, 24);
      
      for (let i = 0; i < maxRows; i++) {
        const row = schedule[i];
        
        // Alternate row colors
        if (i % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(20, currentY - 3, 170, 7, 'F');
        }
        
        doc.setFontSize(9);
        doc.text(String(row.month), 22, currentY + 2);
        doc.text(`Rs.${Number(row.emi).toLocaleString()}`, 55, currentY + 2);
        doc.text(`Rs.${Number(row.interest).toLocaleString()}`, 90, currentY + 2);
        doc.text(`Rs.${Number(row.principal).toLocaleString()}`, 125, currentY + 2);
        doc.text(`Rs.${Number(row.balance).toLocaleString()}`, 160, currentY + 2);
        
        currentY += 7;
      }

      if (schedule.length > 24) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`... and ${schedule.length - 24} more months. Download complete report from the app.`, 20, currentY + 5);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("This is a computer-generated report. No signature required.", 105, 285, { align: "center" });

      // Save with correct filename
      doc.save("Loan_Report.pdf");
      
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Send report to email - Uses logged-in user's email from backend
  const sendToEmail = async () => {
    if (!emiResult || schedule.length === 0) {
      alert("Please calculate EMI first");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to send email report");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("http://localhost:5000/api/emi/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          loanDetails: emiResult,
          schedule: schedule
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Report sent to your email successfully!");
      } else {
        alert(data.message || "Failed to send email. Please check your email configuration.");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Failed to send email. Please check your internet connection.");
    } finally {
      setIsSending(false);
    }
  };

  // Reset all fields
  const resetCalculator = () => {
    setLoanAmount("");
    setInterestRate("");
    setTenure("");
    setEmiResult(null);
    setSchedule([]);
    setShowDetails(false);
    setIsCalculated(false);
  };

  return (
    <div className="w-full">
      <div className="relative bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 overflow-hidden">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-50 via-white to-transparent" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Advanced EMI Calculator
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Calculate your monthly EMI with full payment schedule breakdown.
            </p>
          </div>

          {/* Input Form */}
          <div className="space-y-5">
            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                placeholder="e.g. 500000"
              />
            </div>

            {/* Interest Rate & Tenure */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Interest Rate (% per year)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                  placeholder="e.g. 8.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Tenure (months)
                </label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                  placeholder="e.g. 240"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2">
              <button
                onClick={calculateEMI}
                className="col-span-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
              >
                Calculate EMI
              </button>
              <button
                onClick={() => setShowDetails(true)}
                disabled={!isCalculated}
                className="bg-blue-500 text-white font-semibold py-3 px-3 rounded-xl shadow-sm hover:bg-blue-600 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Details
              </button>
              <button
                onClick={downloadPDF}
                disabled={!isCalculated}
                className="bg-orange-500 text-white font-semibold py-3 px-3 rounded-xl shadow-sm hover:bg-orange-600 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download PDF
              </button>
              <button
                onClick={sendToEmail}
                disabled={!isCalculated || isSending}
                className="bg-purple-500 text-white font-semibold py-3 px-3 rounded-xl shadow-sm hover:bg-purple-600 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? "Sending..." : "Send to Email"}
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetCalculator}
              className="w-full text-sm text-slate-500 hover:text-slate-700 py-2 transition-colors"
            >
              Reset Calculator
            </button>

            {/* Quick Result Preview */}
            {emiResult && !showDetails && (
              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-700 font-medium text-center">
                  Monthly EMI: <span className="text-lg font-bold">₹{Number(emiResult.emi).toLocaleString()}</span>
                </p>
                <div className="flex justify-between mt-2 text-xs text-emerald-600">
                  <span>Total Interest: ₹{Number(emiResult.totalInterest).toLocaleString()}</span>
                  <span>Total: ₹{Number(emiResult.totalPayment).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Details Panel - Slide-in from right */}
          {showDetails && emiResult && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">
                    EMI Details & Payment Schedule
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-emerald-600 mb-1">Monthly EMI</p>
                      <p className="text-lg font-bold text-emerald-700">₹{Number(emiResult.emi).toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-blue-600 mb-1">Loan Amount</p>
                      <p className="text-lg font-bold text-blue-700">₹{Number(emiResult.loanAmount).toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-orange-600 mb-1">Total Interest</p>
                      <p className="text-lg font-bold text-orange-700">₹{Number(emiResult.totalInterest).toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-purple-600 mb-1">Total Payable</p>
                      <p className="text-lg font-bold text-purple-700">₹{Number(emiResult.totalPayment).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Payment Schedule Table */}
                  <h4 className="text-lg font-semibold mb-3 text-slate-800">Monthly Payment Schedule</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-slate-700">Month</th>
                          <th className="px-3 py-2 text-right font-semibold text-slate-700">EMI</th>
                          <th className="px-3 py-2 text-right font-semibold text-slate-700">Interest</th>
                          <th className="px-3 py-2 text-right font-semibold text-slate-700">Principal</th>
                          <th className="px-3 py-2 text-right font-semibold text-slate-700">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.slice(0, 24).map((row) => (
                          <tr key={row.month} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-3 py-2 text-slate-600">{row.month}</td>
                            <td className="px-3 py-2 text-right text-slate-800">₹{Number(row.emi).toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-orange-600">₹{Number(row.interest).toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-blue-600">₹{Number(row.principal).toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-slate-800">₹{Number(row.balance).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {schedule.length > 24 && (
                      <p className="text-center text-sm text-slate-500 mt-2">
                        Showing first 24 months. Download PDF for full schedule.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 border-t flex gap-3 justify-end">
                  <button
                    onClick={downloadPDF}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={sendToEmail}
                    disabled={isSending}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {isSending ? "Sending..." : "Send to Email"}
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoanFormPage from "./pages/LoanFormPage";
import EMICalculatorPage from "./pages/EMICalculatorPage";
import PredictionPage from "./pages/PredictionPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loan-form" element={<ProtectedRoute><LoanFormPage /></ProtectedRoute>} />
        <Route path="/emi-calculator" element={<EMICalculatorPage />} />
        <Route path="/prediction" element={<PredictionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

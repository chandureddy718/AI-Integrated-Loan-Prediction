import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import loanRoutes from "./routes/loan.js";
import emiRoutes from "./routes/emi.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/emi", emiRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);

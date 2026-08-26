import express from "express";
import axios from "axios";
import Prediction from "../models/Prediction.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===================== PREDICT + SAVE ===================== */
router.post("/predict", authMiddleware, async (req, res) => {
  try {
    console.log("USER:", req.user.id);
    console.log("PAYLOAD:", req.body);

    const mlResponse = await axios.post(
      "http://127.0.0.1:5001/predict",
      req.body,
      { timeout: 5000 }
    );

    if (!mlResponse.data || !mlResponse.data.prediction) {
      throw new Error("Invalid ML response");
    }

    const predictionResult = mlResponse.data.prediction;

    await Prediction.create({
      userId: req.user.id,
      inputData: req.body,
      result: predictionResult,
    });

    res.json({
      prediction: predictionResult,
    });
  } catch (error) {
    console.error("Prediction error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({
      message: error.message || "Prediction failed",
      details: error.response?.data || {}
    });
  }
});

/* ===================== GET HISTORY ===================== */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await Prediction.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    // 🔥 FIX: send ARRAY directly
    res.json(history);
  } catch (error) {
    console.error("History error:", error.message);
    res.status(500).json([]);
  }
});

/* ===================== DELETE HISTORY ===================== */
router.delete("/history/:id", authMiddleware, async (req, res) => {
  try {
    await Prediction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;

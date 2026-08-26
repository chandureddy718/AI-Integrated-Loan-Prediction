import axios from "axios";

export const predictLoan = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/predict",
      req.body
    );

    res.json({
      success: true,
      prediction: response.data.prediction,
    });
  } catch (error) {
    console.error("ML ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "ML prediction failed",
    });
  }
};

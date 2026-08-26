import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inputData: Object,
    result: String,
  },
  { timestamps: true }
);

export default mongoose.model("Prediction", predictionSchema);

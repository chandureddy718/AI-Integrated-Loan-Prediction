from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS (no need for manual headers below)
CORS(app)

# Load model and encoders safely
try:
    model = joblib.load("model.pkl")
    encoders = joblib.load("encoders.pkl")
except Exception as e:
    print("Error loading model or encoders:", e)
    model = None
    encoders = None


# ✅ Home route (fix 404 issue)
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Loan Eligibility API is running"})


# ✅ Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if not model or not encoders:
            return jsonify({"error": "Model not loaded properly"}), 500

        data = request.get_json()

        # Validate input
        required_fields = [
            "gender", "married", "dependents", "education",
            "self_employed", "applicant_income", "coapplicant_income",
            "loan_amount", "loan_amount_term", "credit_history", "property_area"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Create DataFrame
        df = pd.DataFrame([{
            "Gender": data["gender"],
            "Married": data["married"],
            "Dependents": data["dependents"],
            "Education": data["education"],
            "Self_Employed": data["self_employed"],
            "Applicant_Income": float(data["applicant_income"]),
            "Coapplicant_Income": float(data["coapplicant_income"]),
            "Loan_Amount": float(data["loan_amount"]),
            "Loan_Amount_Term": float(data["loan_amount_term"]),
            "Credit_History": float(data["credit_history"]),
            "Property_Area": data["property_area"]
        }])

        # Apply encoders
        for col, encoder in encoders.items():
            if col in df.columns:
                df[col] = encoder.transform(df[col])

        # Prediction
        prediction = model.predict(df)[0]
        result = "Approved" if prediction == 1 else "Rejected"

        return jsonify({
            "prediction": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run server
if __name__ == "__main__":
    app.run(debug=True, port=5001)
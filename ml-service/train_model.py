import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("loan.csv")

# Make safe copy
df = df.copy()

# Handle missing values (NO inplace)
df['Gender'] = df['Gender'].fillna(df['Gender'].mode()[0])
df['Married'] = df['Married'].fillna(df['Married'].mode()[0])
df['Dependents'] = df['Dependents'].fillna(df['Dependents'].mode()[0])
df['Self_Employed'] = df['Self_Employed'].fillna(df['Self_Employed'].mode()[0])
df['Education'] = df['Education'].fillna(df['Education'].mode()[0])
df['Property_Area'] = df['Property_Area'].fillna(df['Property_Area'].mode()[0])

df['Applicant_Income'] = df['Applicant_Income'].fillna(df['Applicant_Income'].median())
df['Coapplicant_Income'] = df['Coapplicant_Income'].fillna(df['Coapplicant_Income'].median())
df['Loan_Amount'] = df['Loan_Amount'].fillna(df['Loan_Amount'].median())
df['Loan_Amount_Term'] = df['Loan_Amount_Term'].fillna(df['Loan_Amount_Term'].mode()[0])
df['Credit_History'] = df['Credit_History'].fillna(df['Credit_History'].mode()[0])

# Encode categorical columns
cat_cols = [
    'Gender',
    'Married',
    'Education',
    'Self_Employed',
    'Property_Area',
    'Loan_Status'
]

encoders = {}

for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Features & Target
X = df.drop(columns=['Customer_ID', 'Loan_Status'])
y = df['Loan_Status']

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)
model.fit(X_train, y_train)

# Accuracy
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save model + encoders
joblib.dump(model, "model.pkl")
joblib.dump(encoders, "encoders.pkl")

print("✅ model.pkl generated")
print("✅ encoders.pkl generated")

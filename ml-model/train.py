import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import joblib

# ======================
# 1. LOAD DATA
# ======================
df = pd.read_csv("data/credit_risk_dataset.csv")

# ======================
# 2. HANDLE MISSING
# ======================
df = df.dropna()

# ======================
# 3. ENCODE CATEGORICAL
# ======================
le = LabelEncoder()

df['person_home_ownership'] = le.fit_transform(df['person_home_ownership'])
df['loan_intent'] = le.fit_transform(df['loan_intent'])
df['loan_grade'] = le.fit_transform(df['loan_grade'])
df['cb_person_default_on_file'] = le.fit_transform(df['cb_person_default_on_file'])

# ======================
# 4. FEATURE ENGINEERING
# ======================
df['debt_to_income'] = df['loan_amnt'] / df['person_income']

# ======================
# 5. DEFINE X & Y
# ======================
X = df.drop(columns=["loan_status"])
y = df["loan_status"]

# ======================
# 6. SPLIT DATA
# ======================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ======================
# 7. TRAIN MODEL
# ======================
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression(max_iter=2000))
])
pipeline.fit(X_train, y_train)

# ======================
# 8. EVALUATE
# ======================
y_pred = pipeline.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"Accuracy: {acc}")

# ======================
# 9. SAVE MODEL
# ======================
joblib.dump(pipeline, "model.pkl")  
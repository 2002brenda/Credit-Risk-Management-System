from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

app = FastAPI()

# load model
model = joblib.load("model.pkl")

# request schema
class LoanRequest(BaseModel):
    person_age: int
    person_income: float
    person_home_ownership: int
    person_emp_length: float
    loan_intent: int
    loan_grade: int
    loan_amnt: float
    loan_int_rate: float
    loan_percent_income: float
    cb_person_default_on_file: int
    cb_person_cred_hist_length: float

@app.get("/")
def root():
    return {"message": "ML API Running"}

@app.post("/predict")
def predict(data: LoanRequest):

    # convert to array
    input_data = pd.DataFrame([{
        "person_age": data.person_age,
        "person_income": data.person_income,
        "person_home_ownership": data.person_home_ownership,
        "person_emp_length": data.person_emp_length,
        "loan_intent": data.loan_intent,
        "loan_grade": data.loan_grade,
        "loan_amnt": data.loan_amnt,
        "loan_int_rate": data.loan_int_rate,
        "loan_percent_income": data.loan_percent_income,
        "cb_person_default_on_file": data.cb_person_default_on_file,
        "cb_person_cred_hist_length": data.cb_person_cred_hist_length,
        "debt_to_income": data.loan_amnt / data.person_income
    }])
    # predict
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]
    
    # tambahan feature engineering
    debt_to_income = data.loan_amnt / data.person_income

    # decision logic risk
    if probability > 0.7:
        decision = "Rejected"
    elif probability > 0.4:
        decision = "Review"
    else:
        decision = "Approved"

    return {
        "prediction": int(prediction),
        "probability": float(probability),
        "decision": decision,
        "debt_to_income": float(debt_to_income)
    }
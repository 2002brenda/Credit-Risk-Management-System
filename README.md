
# 🏦 Credit Risk Management System

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=.net)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.0-0170FE?logo=antdesign)](https://ant.design/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive **Credit Risk Management System** that leverages Machine Learning to predict loan default risk. Built with ASP.NET Core backend, React + TypeScript frontend, and integrated with a Python ML model.

---

## 🚀 Live Demo

> Coming Soon!

---

## 📊 Features

### 🤖 AI-Powered Risk Assessment
- Machine Learning model predicts loan default probability
- Real-time risk scoring and grading (A/B/C/D)
- Automatic loan status determination (Approved/Pending/Rejected)

### 📈 Interactive Dashboard
- Real-time statistics (Total Loans, Approved, Rejected, Pending)
- Multiple chart visualizations:
  - Loan Status Distribution (Pie Chart)
  - ML Decision Distribution (Bar Chart)
  - Loan Application Trend (Area Chart)
  - Risk Score Distribution (Bar Chart)
  - Income vs Loan Amount (Scatter Plot)

### 📋 Complete CRUD Operations
- Create new loan applications with comprehensive applicant data
- Edit loan status (Pending/Approved/Rejected)
- Delete loan records
- Evaluate loans manually or via ML model

### 📤 Export & Reporting
- Export data to CSV format
- Generate PDF reports with summary statistics
- Downloadable loan reports

### 🔍 Data Quality & Analytics
- Data quality validation and monitoring
- Missing values detection
- Outlier identification
- Risk score distribution analysis

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| ASP.NET Core 8.0 | REST API Framework |
| Entity Framework Core | ORM for database operations |
| SQL Server | Relational database |
| Hangfire | Background job scheduling |
| Swagger | API documentation |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type safety |
| Ant Design | UI Components |
| Recharts | Data visualization |
| Axios | HTTP client |
| jspdf | PDF generation |

### Machine Learning
| Technology | Purpose |
|------------|---------|
| Python FastAPI | ML model serving |
| XGBoost | Classification model |
| Pandas/NumPy | Data processing |

---

## 📁 Project Structure

```
CreditRiskManagementSystem/
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   └── Program.cs
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
└── ml-model/
    └── main.py
```

---

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- SQL Server or SQL Server LocalDB
- Python 3.9+ (for ML model)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/credit-risk-management.git
cd credit-risk-management
```

#### 2. Setup Backend
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
API runs at `https://localhost:5292`

#### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`

#### 4. Setup ML Model (Optional)
```bash
cd ml-model
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/LoanApplications` | Get all loans |
| GET | `/api/LoanApplications/{id}` | Get loan by ID |
| POST | `/api/LoanApplications` | Create new loan |
| PUT | `/api/LoanApplications/{id}/status` | Update loan status |
| POST | `/api/LoanApplications/{id}/evaluate` | Run ML evaluation |
| DELETE | `/api/LoanApplications/{id}` | Delete loan |
| GET | `/api/LoanApplications/summary` | Get summary statistics |
| GET | `/api/LoanApplications/ranking` | Get top risky loans |
| GET | `/api/LoanApplications/data-quality` | Get data quality report |

---

## 📊 Risk Score Interpretation

| Grade | Risk Level | ML Score | Action |
|-------|------------|----------|--------|
| 🟢 A | Low Risk | 80-100 | ✅ Approved |
| 🔵 B | Medium Risk | 60-79 | ⚠️ Consider |
| 🟠 C | High Risk | 40-59 | ⚠️ High chance of default |
| 🔴 D | Very High Risk | < 40 | ❌ Rejected |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---



## ⭐ Star History

If you find this project useful, please give it a star! ⭐
```

---

## 📁 .gitignore

```gitignore
# Backend
backend/bin/
backend/obj/
backend/appsettings.Development.json

# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env.local

# IDE
.vscode/
.idea/
*.suo
*.user

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Database
*.mdf
*.ldf
```



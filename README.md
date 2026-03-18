# Credit Risk Management System

Fullstack loan risk evaluation system built with ASP.NET Core and React.

## Features

- Loan application management
- Risk scoring evaluation
- Loan approval / rejection workflow
- Dashboard analytics
- Search functionality
- Real-time data updates

## Tech Stack

Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Repository Pattern

Frontend
- React
- TypeScript
- Ant Design
- React Query
- Recharts

Infrastructure
- Docker
- Docker Compose

## Architecture

Frontend (React)
↓
REST API (ASP.NET)
↓
SQL Server Database

## Running the Project

Start database

docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong!Pass123" -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest

Run backend

dotnet run

Run frontend

npm install
npm run dev

## API Endpoints

GET /api/LoanApplications  
POST /api/LoanApplications  
POST /api/LoanApplications/{id}/evaluate

## Screenshots

Dashboard
Loan statistics
Risk evaluation
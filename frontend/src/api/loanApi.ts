import axios from "axios"
import type { LoanApplication } from "../types"

const api = axios.create({
  baseURL: "http://localhost:5292/api"
})

export const getLoans = async (): Promise<LoanApplication[]> => {
  const res = await api.get("/LoanApplications")
  return res.data
}

export const createLoan = async (data:any) => {
  console.log("SEND TO API:", data)
  const res = await api.post("/LoanApplications", data)
  return res.data
}

export const evaluateLoan = async (id: string) => {
  const res = await api.post(`/LoanApplications/${id}/evaluate`)
  return res.data
}

export const getSummary = async () => {
  const res = await api.get("/LoanApplications/summary")
  return res.data
}

export const exportLoansCSV = async () => {
  const res = await api.get("/LoanApplications/export", {
    responseType: "blob"  
  })
  return res.data
} 

export const updateStatus = async (id: string, status: string) => {
  const res = await api.put(`/LoanApplications/${id}/status`, { status })
  return res.data
}

export const getRanking = async () => {
  const res = await api.get("/LoanApplications/ranking")
  return res.data
}

export const deleteLoan = async (id: string) => {
  const res = await api.delete(`/LoanApplications/${id}`)
  return res.data
}
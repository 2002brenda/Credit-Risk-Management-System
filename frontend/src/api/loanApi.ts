import axios from "axios"
import type { LoanApplication } from "../types"

const api = axios.create({
  baseURL: "http://localhost:5292/api"
})

export const getLoans = async (): Promise<LoanApplication[]> => {
  const res = await api.get("/LoanApplications")
  return res.data
}

export const createLoan = async (data: Partial<LoanApplication>) => {
  const res = await api.post("/LoanApplications", data)
  return res.data
}

export const evaluateLoan = async (id: string) => {
  const res = await api.post(`/LoanApplications/${id}/evaluate`)
  return res.data
}
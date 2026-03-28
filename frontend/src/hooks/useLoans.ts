import { useQuery } from "@tanstack/react-query"
import { getLoans } from "../api/loanApi"
import type { LoanApplication } from "../types"
import { getSummary } from "../api/loanApi"

export const useSummary = () => {
  return useQuery({
    queryKey: ["summary"],
    queryFn: getSummary
  })
}

export const useLoans = () => {
  return useQuery({
    queryKey: ["loans"],
    queryFn: async () => {  // ✅ Pakai kurung kurawal { }, bukan [ ]
      const res = await getLoans()
      return res  // ✅ Langsung return res (getLoans sudah return data)
    }
  })
}
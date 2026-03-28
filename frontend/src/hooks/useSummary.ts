import { useQuery } from "@tanstack/react-query"
import { getSummary } from "../api/loanApi"

export const useSummary = () => {
  return useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  })
}
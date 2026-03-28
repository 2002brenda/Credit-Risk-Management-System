import { useQuery } from "@tanstack/react-query"
import { getRanking } from "../api/loanApi"

export const useRanking = () => {
  return useQuery({
    queryKey: ["ranking"],
    queryFn: getRanking
  })
}
namespace CreditRiskManagementSystem.Services
{
    public class RiskScoringService
    {
        public decimal CalculateRiskScore(decimal income, decimal loanAmount, decimal existingDebt)
        {
            if (income == 0)
                return 0;

            var debtRatio = existingDebt / income;
            var loanRatio = loanAmount / income;

            var riskScore = (debtRatio * 0.6m) + (loanRatio * 0.4m);

            return riskScore;
        }

        public string GetRiskLevel(decimal riskScore)
        {
            if (riskScore < 0.3m)
                return "LOW";

            if (riskScore < 0.7m)
                return "MEDIUM";

            return "HIGH";
        }
    }
}
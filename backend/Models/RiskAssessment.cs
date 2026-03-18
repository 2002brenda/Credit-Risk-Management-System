using System;
using System.ComponentModel.DataAnnotations;

namespace CreditRiskManagementSystem.Models
{
    public class RiskAssessment
    {
        public int Id { get; set; }

        public Guid LoanId { get; set; }

        public decimal RiskScore { get; set; }

        public string RiskLevel { get; set; }

        public DateTime AssessedAt { get; set; } = DateTime.UtcNow;
    }
}
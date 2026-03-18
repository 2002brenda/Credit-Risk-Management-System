using System;
using System.ComponentModel.DataAnnotations;

namespace CreditRiskManagementSystem.Models
{
    public class LoanApplication
    {
        public Guid Id { get; set; }

        [Required]
        public string ApplicantName { get; set; }

        public decimal Income { get; set; }

        public decimal LoanAmount { get; set; }

        public decimal ExistingDebt { get; set; }

        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
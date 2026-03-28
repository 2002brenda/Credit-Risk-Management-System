using System;
using System.ComponentModel.DataAnnotations;

namespace CreditRiskManagementSystem.Models
{
    public class LoanApplication
    {
        public Guid Id { get; set; }

        [Required]
        public string ApplicantName { get; set; } = "";

        public decimal Income { get; set; }

        public decimal LoanAmount { get; set; }

        public decimal ExistingDebt { get; set; }

        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int RiskScore { get; set; } = 0;

        public string RiskGrade { get; set; } = "C";

        public int PersonAge { get; set; }

        public string PersonHomeOwnership { get; set; }

        public int PersonEmpLength { get; set; }

        public string LoanIntent { get; set; }

        public string LoanGrade { get; set; }

        public string CbPersonDefaultOnFile { get; set; } 

        public int CbPersonCredHistLength { get; set; }


    }
}
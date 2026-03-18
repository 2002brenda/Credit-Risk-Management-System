using System;

namespace CreditRiskManagementSystem.Models
{
    public class LoanStatusHistory
    {
        public int Id { get; set; }

        public Guid LoanId { get; set; }

        public string OldStatus { get; set; }

        public string NewStatus { get; set; }

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    }
}
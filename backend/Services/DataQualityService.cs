using CreditRiskManagementSystem.Data;
using CreditRiskManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CreditRiskManagementSystem.Services
{
    public class DataQualityService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DataQualityService> _logger;

        public DataQualityService(AppDbContext context, ILogger<DataQualityService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<DataQualityReport> CheckDataQuality()
        {
            var loans = await _context.LoanApplications.ToListAsync();
            
            var report = new DataQualityReport
            {
                TotalRecords = loans.Count,
                MissingValues = new Dictionary<string, int>(),
                Outliers = new Dictionary<string, int>(),
                InvalidData = new Dictionary<string, int>(),
                LastChecked = DateTime.UtcNow
            };
            
            // Check missing values
            report.MissingValues["applicantName"] = loans.Count(l => string.IsNullOrEmpty(l.ApplicantName));
            report.MissingValues["personAge"] = loans.Count(l => l.PersonAge <= 0);
            report.MissingValues["income"] = loans.Count(l => l.Income <= 0);
            report.MissingValues["loanAmount"] = loans.Count(l => l.LoanAmount <= 0);
            report.MissingValues["personHomeOwnership"] = loans.Count(l => string.IsNullOrEmpty(l.PersonHomeOwnership));
            report.MissingValues["loanIntent"] = loans.Count(l => string.IsNullOrEmpty(l.LoanIntent));
            
            // Check outliers
            report.Outliers["income > 1,000,000,000"] = loans.Count(l => l.Income > 1000000000);
            report.Outliers["loanAmount > income (x3)"] = loans.Count(l => l.LoanAmount > l.Income * 3);
            report.Outliers["age > 80"] = loans.Count(l => l.PersonAge > 80);
            report.Outliers["age < 18"] = loans.Count(l => l.PersonAge < 18 && l.PersonAge > 0);
            
            // Check invalid data
            report.InvalidData["negative income"] = loans.Count(l => l.Income < 0);
            report.InvalidData["negative loanAmount"] = loans.Count(l => l.LoanAmount < 0);
            report.InvalidData["invalid home ownership"] = loans.Count(l => 
                !string.IsNullOrEmpty(l.PersonHomeOwnership) && 
                l.PersonHomeOwnership != "RENT" && 
                l.PersonHomeOwnership != "OWN" && 
                l.PersonHomeOwnership != "MORTGAGE");
            
            // Log the check
            _logger.LogInformation("Data quality check completed. Total: {Total}, Missing: {Missing}, Outliers: {Outliers}", 
                report.TotalRecords, 
                report.MissingValues.Values.Sum(), 
                report.Outliers.Values.Sum());
            
            return report;
        }
        
        public async Task<bool> ValidateLoanData(LoanApplication loan)
        {
            var isValid = true;
            var errors = new List<string>();
            
            if (loan.Income <= 0)
            {
                errors.Add("Income must be greater than 0");
                isValid = false;
            }
            
            if (loan.LoanAmount <= 0)
            {
                errors.Add("Loan amount must be greater than 0");
                isValid = false;
            }
            
            if (loan.PersonAge < 18 && loan.PersonAge > 0)
            {
                errors.Add("Age must be at least 18 years");
                isValid = false;
            }
            
            if (loan.PersonAge > 100)
            {
                errors.Add("Age cannot exceed 100 years");
                isValid = false;
            }
            
            if (loan.LoanAmount > loan.Income * 5)
            {
                errors.Add("Loan amount exceeds 5x annual income (high risk)");
                isValid = false;
            }
            
            if (string.IsNullOrEmpty(loan.PersonHomeOwnership))
            {
                errors.Add("Home ownership is required");
                isValid = false;
            }
            
            if (string.IsNullOrEmpty(loan.LoanIntent))
            {
                errors.Add("Loan intent is required");
                isValid = false;
            }
            
            if (errors.Any())
            {
                _logger.LogWarning("Data validation failed for {Name}: {Errors}", 
                    loan.ApplicantName, string.Join(", ", errors));
            }
            
            return isValid;
        }
        
        public async Task<DataQualitySummary> GetQualitySummary()
        {
            var loans = await _context.LoanApplications.ToListAsync();
            
            return new DataQualitySummary
            {
                TotalLoans = loans.Count,
                CompleteRecords = loans.Count(l => 
                    !string.IsNullOrEmpty(l.ApplicantName) &&
                    l.PersonAge > 0 &&
                    l.Income > 0 &&
                    l.LoanAmount > 0 &&
                    !string.IsNullOrEmpty(l.PersonHomeOwnership) &&
                    !string.IsNullOrEmpty(l.LoanIntent)),
                
                ApprovalRate = loans.Any() ? 
                    (double)loans.Count(l => l.Status == "Approved") / loans.Count * 100 : 0,
                
                AverageRiskScore = loans.Any() ? loans.Average(l => l.RiskScore) : 0,
                
                RiskGradeDistribution = new Dictionary<string, int>
                {
                    ["A"] = loans.Count(l => l.RiskGrade == "A"),
                    ["B"] = loans.Count(l => l.RiskGrade == "B"),
                    ["C"] = loans.Count(l => l.RiskGrade == "C"),
                    ["D"] = loans.Count(l => l.RiskGrade == "D")
                }
            };
        }
    }
    
    public class DataQualityReport
{
    public int TotalRecords { get; set; }
    public Dictionary<string, int> MissingValues { get; set; } = new Dictionary<string, int>();
    public Dictionary<string, int> Outliers { get; set; } = new Dictionary<string, int>();
    public Dictionary<string, int> InvalidData { get; set; } = new Dictionary<string, int>();
    public DateTime LastChecked { get; set; }
}

public class DataQualitySummary
{
    public int TotalLoans { get; set; }
    public int CompleteRecords { get; set; }
    public double ApprovalRate { get; set; }
    public double AverageRiskScore { get; set; }
    public Dictionary<string, int> RiskGradeDistribution { get; set; } = new Dictionary<string, int>();
}
}
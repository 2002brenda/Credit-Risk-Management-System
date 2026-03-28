using Microsoft.AspNetCore.Mvc;
using CreditRiskManagementSystem.Data;
using CreditRiskManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;

namespace CreditRiskManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public LoanApplicationsController(AppDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var loans = await _context.LoanApplications.ToListAsync();
            return Ok(loans);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var loan = await _context.LoanApplications.FindAsync(id);

            if (loan == null)
                return NotFound();

            return Ok(loan);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LoanApplication loan)
        {
            loan.Id = Guid.NewGuid();
            loan.CreatedAt = DateTime.UtcNow;

            var client = _httpClientFactory.CreateClient();

            try
            {
                var requestBody = new
                {
                    person_age = loan.PersonAge,
                    person_income = loan.Income,
                    person_home_ownership = MapHomeOwnership(loan.PersonHomeOwnership),
                    person_emp_length = loan.PersonEmpLength,
                    loan_intent = MapLoanIntent(loan.LoanIntent),
                    loan_grade = MapLoanGrade(loan.LoanGrade),
                    loan_amnt = loan.LoanAmount,
                    loan_int_rate = 10,
                    loan_percent_income = loan.Income == 0 ? 0 : loan.LoanAmount / loan.Income,
                    cb_person_default_on_file = MapDefault(loan.CbPersonDefaultOnFile),
                    cb_person_cred_hist_length = loan.CbPersonCredHistLength
                };

                var response = await client.PostAsJsonAsync(
                    "http://127.0.0.1:8000/predict",
                    requestBody
                );

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<PredictResponse>();

                    if (result != null)
                    {
                        loan.Status = result.decision ?? "Pending";
                        loan.RiskScore = (int)(result.probability * 100);

                        if (result.probability > 0.7)
                            loan.RiskGrade = "D";
                        else if (result.probability > 0.4)
                            loan.RiskGrade = "C";
                        else if (result.probability > 0.2)
                            loan.RiskGrade = "B";
                        else
                            loan.RiskGrade = "A";
                    }
                    else
                    {
                        // fallback kalau response null
                        loan.Status = "Pending";
                        loan.RiskScore = 0;
                        loan.RiskGrade = "C";
                    }
                }
                else
                {
                    // fallback kalau ML error
                    loan.Status = "Pending";
                    loan.RiskScore = 0;
                    loan.RiskGrade = "C";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("ML ERROR: " + ex.Message);

                // fallback kalau ML mati
                loan.Status = "Pending";
                loan.RiskScore = 0;
                loan.RiskGrade = "C";
            }

            _context.LoanApplications.Add(loan);
            await _context.SaveChangesAsync();

            return Ok(loan);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var loan = await _context.LoanApplications.FindAsync(id);

            if (loan == null)
                return NotFound();

            _context.LoanApplications.Remove(loan);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{id}/evaluate")]
        public async Task<IActionResult> Evaluate(Guid id)
        {
            var loan = await _context.LoanApplications.FindAsync(id);

            if (loan == null)
                return NotFound();

            int score = 0;

            if (loan.Income != 0)
            {
                var ratio = loan.LoanAmount / loan.Income;

                if (ratio < 0.3m) score += 40;
                else if (ratio < 0.5m) score += 25;
                else score += 10;

                var debtRatio = loan.ExistingDebt / loan.Income;

                if (debtRatio < 0.2m) score += 30;
                else if (debtRatio < 0.4m) score += 20;
                else score += 5;
            }

            if (loan.Income > 10000000m) score += 30;
            else if (loan.Income > 5000000m) score += 20;
            else score += 10;

            loan.RiskScore = score;

            if (score >= 80)
            {
                loan.RiskGrade = "A";
                loan.Status = "Approved";
            }
            else if (score >= 60)
            {
                loan.RiskGrade = "B";
                loan.Status = "Approved";
            }
            else if (score >= 40)
            {
                loan.RiskGrade = "C";
                loan.Status = "Pending Review";
            }
            else
            {
                loan.RiskGrade = "D";
                loan.Status = "Rejected";
            }

            await _context.SaveChangesAsync();

            return Ok(loan);
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var loans = await _context.LoanApplications.ToListAsync();

            var total = loans.Count;
            var approved = loans.Count(l => l.Status == "Approved");
            var rejected = loans.Count(l => l.Status == "Rejected");
            var pending = loans.Count(l => l.Status == "Pending");

            var avgScore = loans.Any() ? loans.Average(l => l.RiskScore) : 0;

            return Ok(new
            {
                total,
                approved,
                rejected,
                pending,
                avgScore
            });
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
        {
            var loan = await _context.LoanApplications.FindAsync(id);
            
            if (loan == null)
                return NotFound();
            
            // Update status
            loan.Status = request.Status;
            
            await _context.SaveChangesAsync();
            
            return Ok(loan);
        }

        // Ranking berdasarkan RiskScore
        [HttpGet("ranking")]
        public async Task<IActionResult> GetRanking()
        {
            var loans = await _context.LoanApplications
                .OrderByDescending(l => l.RiskScore)
                .Take(10)
                .ToListAsync();

            return Ok(loans);
        }

        // MAPPING
        private int MapHomeOwnership(string value) => value switch
        {
            "RENT" => 0,
            "OWN" => 1,
            "MORTGAGE" => 2,
            _ => 0
        };

        private int MapLoanIntent(string value) => value switch
        {
            "PERSONAL" => 0,
            "EDUCATION" => 1,
            "MEDICAL" => 2,
            _ => 0
        };

        private int MapLoanGrade(string value) => value switch
        {
            "A" => 0,
            "B" => 1,
            "C" => 2,
            _ => 2
        };

        private int MapDefault(string value) => value switch
        {
            "N" => 0,
            "Y" => 1,
            _ => 0
        };
    }

    public class PredictResponse
    {
        public int prediction { get; set; }
        public double probability { get; set; }
        public string decision { get; set; }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; }
    }
}
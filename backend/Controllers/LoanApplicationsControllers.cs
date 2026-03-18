using Microsoft.AspNetCore.Mvc;
using CreditRiskManagementSystem.Data;
using CreditRiskManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CreditRiskManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoanApplicationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/LoanApplications
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var loans = await _context.LoanApplications.ToListAsync();
            return Ok(loans);
        }

        // GET api/LoanApplications/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var loan = await _context.LoanApplications.FindAsync(id);

            if (loan == null)
                return NotFound();

            return Ok(loan);
        }

        // POST api/LoanApplications
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LoanApplication loan)
        {
            loan.Id = Guid.NewGuid();
            loan.Status = "Pending";
            loan.CreatedAt = DateTime.UtcNow;

            _context.LoanApplications.Add(loan);
            await _context.SaveChangesAsync();

            return Ok(loan);
        }
    }
}
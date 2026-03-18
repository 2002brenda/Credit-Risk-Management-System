using CreditRiskManagementSystem.Data;
using CreditRiskManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CreditRiskManagementSystem.Repositories
{
    public class LoanApplicationRepository : ILoanApplicationRepository
    {
        private readonly AppDbContext _context;

        public LoanApplicationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<LoanApplication>> GetAllAsync()
        {
            return await _context.LoanApplications.ToListAsync();
        }

        public async Task<LoanApplication?> GetByIdAsync(Guid id)
        {
            return await _context.LoanApplications.FindAsync(id);
        }

        public async Task AddAsync(LoanApplication application)
        {
            _context.LoanApplications.Add(application);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(LoanApplication application)
        {
            _context.LoanApplications.Update(application);
            await _context.SaveChangesAsync();
        }
    }
}
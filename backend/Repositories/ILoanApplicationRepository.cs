using CreditRiskManagementSystem.Models;

namespace CreditRiskManagementSystem.Repositories
{
    public interface ILoanApplicationRepository
    {
        Task<List<LoanApplication>> GetAllAsync();
        Task<LoanApplication?> GetByIdAsync(Guid id);
        Task AddAsync(LoanApplication application);
        Task UpdateAsync(LoanApplication application);
    }
}
using Microsoft.EntityFrameworkCore;
using CreditRiskManagementSystem.Models;

namespace CreditRiskManagementSystem.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<LoanApplication> LoanApplications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<LoanApplication>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.ApplicantName)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.Income)
                      .HasPrecision(18,2);

                entity.Property(e => e.LoanAmount)
                      .HasPrecision(18,2);

                entity.Property(e => e.ExistingDebt)
                      .HasPrecision(18,2);

                entity.Property(e => e.Status)
                      .HasMaxLength(50)
                      .HasDefaultValue("Pending");

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}
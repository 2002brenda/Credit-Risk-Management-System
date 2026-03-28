using CreditRiskManagementSystem.Data;
using CreditRiskManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // ✅ TAMBAHKAN PORT 5174 (frontend kamu)
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/", () => "Credit Risk API Running");
app.MapControllers();

// SEED DATA
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!context.LoanApplications.Any())
    {
        context.LoanApplications.Add(new LoanApplication
        {
            ApplicantName = "Sample",
            Income = 10000000,
            LoanAmount = 3000000,
            ExistingDebt = 1000000, 
            PersonAge = 30,
            PersonHomeOwnership = "RENT",
            PersonEmpLength = 5,
            LoanIntent = "PERSONAL",
            LoanGrade = "B",
            CbPersonDefaultOnFile = "N",
            CbPersonCredHistLength = 5,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        });

        context.SaveChanges();
    }
}

app.Run();
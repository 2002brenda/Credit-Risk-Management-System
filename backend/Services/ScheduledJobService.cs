using Hangfire;
using Microsoft.Extensions.Logging;

namespace CreditRiskManagementSystem.Services
{
    public class ScheduledJobService
    {
        private readonly DataQualityService _dataQualityService;
        private readonly ILogger<ScheduledJobService> _logger;

        public ScheduledJobService(DataQualityService dataQualityService, ILogger<ScheduledJobService> logger)
        {
            _dataQualityService = dataQualityService;
            _logger = logger;
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task RunDailyDataQualityCheck()
        {
            _logger.LogInformation("Starting daily data quality check at {Time}", DateTime.UtcNow);
            try
            {
                var report = await _dataQualityService.CheckDataQuality();
                _logger.LogInformation("Data quality check completed. Total: {Total}, Missing: {Missing}, Outliers: {Outliers}", 
                    report.TotalRecords, 
                    report.MissingValues.Values.Sum(), 
                    report.Outliers.Values.Sum());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Data quality check failed");
                throw;
            }
        }
        
        [AutomaticRetry(Attempts = 2)]
        public async Task RunWeeklySummary()
        {
            _logger.LogInformation("Starting weekly summary generation at {Time}", DateTime.UtcNow);
            try
            {
                var summary = await _dataQualityService.GetQualitySummary();
                _logger.LogInformation("Weekly summary: {@Summary}", summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Weekly summary generation failed");
                throw;
            }
        }
    }
}
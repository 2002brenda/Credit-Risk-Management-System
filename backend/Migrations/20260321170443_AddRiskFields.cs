using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CreditRiskManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddRiskFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RiskGrade",
                table: "LoanApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RiskScore",
                table: "LoanApplications",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RiskGrade",
                table: "LoanApplications");

            migrationBuilder.DropColumn(
                name: "RiskScore",
                table: "LoanApplications");
        }
    }
}

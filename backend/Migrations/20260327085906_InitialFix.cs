using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CreditRiskManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class InitialFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CbPersonCredHistLength",
                table: "LoanApplications",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CbPersonCredHistLength",
                table: "LoanApplications",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}

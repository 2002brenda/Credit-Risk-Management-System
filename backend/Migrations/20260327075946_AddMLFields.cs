using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CreditRiskManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddMLFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CbPersonCredHistLength",
                table: "LoanApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CbPersonDefaultOnFile",
                table: "LoanApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LoanGrade",
                table: "LoanApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LoanIntent",
                table: "LoanApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PersonAge",
                table: "LoanApplications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PersonEmpLength",
                table: "LoanApplications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PersonHomeOwnership",
                table: "LoanApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CbPersonCredHistLength",
                table: "LoanApplications");

            migrationBuilder.DropColumn(
                name: "CbPersonDefaultOnFile",
                table: "LoanApplications");

            migrationBuilder.DropColumn(
                name: "LoanGrade",
                table: "LoanApplications");

            migrationBuilder.DropColumn(
                name: "LoanIntent",
                table: "LoanApplications");

            migrationBuilder.DropColumn(
                name: "PersonAge",
                table: "LoanApplications");

            migrationBuilder.DropColumn(
                name: "PersonEmpLength",
                table: "LoanApplications");

            migrationBuilder.DropColumn(
                name: "PersonHomeOwnership",
                table: "LoanApplications");
        }
    }
}

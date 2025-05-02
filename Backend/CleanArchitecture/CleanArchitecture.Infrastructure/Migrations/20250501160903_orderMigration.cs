using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchitecture.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class orderMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "RentalProduct");

            migrationBuilder.RenameColumn(
                name: "Quantity",
                table: "RentalProduct",
                newName: "RentalDuration");

            migrationBuilder.AddColumn<DateTime>(
                name: "ProductRentalHistories",
                table: "RentalProduct",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "RentalPeriodType",
                table: "RentalProduct",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductRentalHistories",
                table: "RentalProduct");

            migrationBuilder.DropColumn(
                name: "RentalPeriodType",
                table: "RentalProduct");

            migrationBuilder.RenameColumn(
                name: "RentalDuration",
                table: "RentalProduct",
                newName: "Quantity");

            migrationBuilder.AddColumn<double>(
                name: "UnitPrice",
                table: "RentalProduct",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}

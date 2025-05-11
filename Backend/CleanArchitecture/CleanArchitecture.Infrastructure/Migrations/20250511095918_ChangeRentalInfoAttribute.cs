using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchitecture.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRentalInfoAttribute : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndRentDate",
                table: "RentInfo");

            migrationBuilder.DropColumn(
                name: "StartRentDate",
                table: "RentInfo");

            migrationBuilder.RenameColumn(
                name: "RentalTime",
                table: "RentInfo",
                newName: "ReciverPhone");

            migrationBuilder.AddColumn<string>(
                name: "ReciverAddress",
                table: "RentInfo",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReciverName",
                table: "RentInfo",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReciverAddress",
                table: "RentInfo");

            migrationBuilder.DropColumn(
                name: "ReciverName",
                table: "RentInfo");

            migrationBuilder.RenameColumn(
                name: "ReciverPhone",
                table: "RentInfo",
                newName: "RentalTime");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndRentDate",
                table: "RentInfo",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartRentDate",
                table: "RentInfo",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}

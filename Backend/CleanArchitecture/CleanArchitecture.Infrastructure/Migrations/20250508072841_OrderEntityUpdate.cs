using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchitecture.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class OrderEntityUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalProducts_Orders_OrderID",
                table: "RentalProducts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RentalProducts",
                table: "RentalProducts");

            migrationBuilder.RenameTable(
                name: "RentalProducts",
                newName: "RentalProducts");

            migrationBuilder.RenameIndex(
                name: "IX_RentalProducts_OrderID",
                table: "RentalProducts",
                newName: "IX_RentalProducts_OrderID");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndRentTime",
                table: "RentalProducts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartRentTime",
                table: "RentalProducts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<double>(
                name: "TotalPrice",
                table: "RentalProducts",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_RentalProducts",
                table: "RentalProducts",
                column: "RentalItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalProducts_Orders_OrderID",
                table: "RentalProducts",
                column: "OrderID",
                principalTable: "Orders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalProducts_Orders_OrderID",
                table: "RentalProducts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RentalProducts",
                table: "RentalProducts");

            migrationBuilder.DropColumn(
                name: "EndRentTime",
                table: "RentalProducts");

            migrationBuilder.DropColumn(
                name: "StartRentTime",
                table: "RentalProducts");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "RentalProducts");

            migrationBuilder.RenameTable(
                name: "RentalProducts",
                newName: "RentalProducts");

            migrationBuilder.RenameIndex(
                name: "IX_RentalProducts_OrderID",
                table: "RentalProducts",
                newName: "IX_RentalProducts_OrderID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RentalProducts",
                table: "RentalProducts",
                column: "RentalItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalProducts_Orders_OrderID",
                table: "RentalProducts",
                column: "OrderID",
                principalTable: "Orders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

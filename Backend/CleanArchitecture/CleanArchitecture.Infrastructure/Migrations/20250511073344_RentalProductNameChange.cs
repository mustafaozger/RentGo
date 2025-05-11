using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchitecture.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RentalProductNameChange : Migration
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
                newName: "RentalProduct");

            migrationBuilder.RenameIndex(
                name: "IX_RentalProducts_OrderID",
                table: "RentalProduct",
                newName: "IX_RentalProduct_OrderID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RentalProduct",
                table: "RentalProduct",
                column: "RentalItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalProduct_Orders_OrderID",
                table: "RentalProduct",
                column: "OrderID",
                principalTable: "Orders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalProduct_Orders_OrderID",
                table: "RentalProduct");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RentalProduct",
                table: "RentalProduct");

            migrationBuilder.RenameTable(
                name: "RentalProduct",
                newName: "RentalProducts");

            migrationBuilder.RenameIndex(
                name: "IX_RentalProduct_OrderID",
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

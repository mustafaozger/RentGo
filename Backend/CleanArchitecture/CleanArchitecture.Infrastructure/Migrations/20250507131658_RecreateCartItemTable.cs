using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchitecture.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RecreateCartItemTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                    name: "CartItem",
                    columns: table => new
                    {
                        CartItemId       = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                        CartId           = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                        ProductId        = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                        RentalDuration   = table.Column<int>(type: "int", nullable: false),
                        
                        RentalPeriodType = table.Column<string>(
                                            type: "nvarchar(20)",
                                            nullable: false)
                    },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_CartItem", x => x.CartItemId);
                        table.ForeignKey(
                            name: "FK_CartItem_Carts_CartId",
                            column: x => x.CartId,
                            principalTable: "Carts",
                            principalColumn: "CartId",
                            onDelete: ReferentialAction.Cascade);
                        table.ForeignKey(
                            name: "FK_CartItem_Products_ProductId",
                            column: x => x.ProductId,
                            principalTable: "Products",
                            principalColumn: "Id",
                            onDelete: ReferentialAction.Cascade);
                    });

                migrationBuilder.CreateIndex(
                    name: "IX_CartItem_CartId",
                    table: "CartItem",
                    column: "CartId");

                migrationBuilder.CreateIndex(
                    name: "IX_CartItem_ProductId",
                    table: "CartItem",
                    column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("CartItem");
        }
    }
}

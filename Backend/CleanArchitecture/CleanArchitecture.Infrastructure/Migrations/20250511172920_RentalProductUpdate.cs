using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchitecture.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RentalProductUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RentalProducts_ProductImageList",
                columns: table => new
                {
                    RentalProductRentalItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalProducts_ProductImageList", x => new { x.RentalProductRentalItemId, x.Id });
                    table.ForeignKey(
                        name: "FK_RentalProducts_ProductImageList_RentalProducts_RentalProductRentalItemId",
                        column: x => x.RentalProductRentalItemId,
                        principalTable: "RentalProducts",
                        principalColumn: "RentalItemId",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RentalProducts_ProductImageList");
        }
    }
}

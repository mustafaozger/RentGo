using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchitecture.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RentalProductUpdated2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentalProductImageListJson",
                table: "RentalProducts");

            migrationBuilder.RenameColumn(
                name: "ProductImageListJson",
                table: "Products",
                newName: "ProductImageList");

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

            migrationBuilder.RenameColumn(
                name: "ProductImageList",
                table: "Products",
                newName: "ProductImageListJson");

            migrationBuilder.AddColumn<string>(
                name: "RentalProductImageListJson",
                table: "RentalProducts",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class articleimage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "image",
                table: "Articles");

            migrationBuilder.AddColumn<string>(
                name: "imagePath",
                table: "Articles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "imagePath",
                table: "Articles");

            migrationBuilder.AddColumn<byte[]>(
                name: "image",
                table: "Articles",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionFactura.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AgregarRucAConfiguracionEmpresa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ruc",
                table: "CompanyConfigs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ruc",
                table: "CompanyConfigs");
        }
    }
}

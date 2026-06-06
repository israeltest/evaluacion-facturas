namespace GestionFactura.Infrastructure.Data;

using GestionFactura.Domain.Entities;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Client> Clients { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<CompanyConfig> CompanyConfigs { get; set; } = null!;
    
    public DbSet<Invoice> Invoices { get; set; } = null!;
    public DbSet<InvoiceDetail> InvoiceDetails { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // borrado en cascada para que no queden detalles huerfanos
        modelBuilder.Entity<InvoiceDetail>()
            .HasOne(d => d.Invoice)
            .WithMany(i => i.Details)
            .HasForeignKey(d => d.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // seteo global para los dineros
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetColumnType("decimal(18,2)");
        }
    }
}

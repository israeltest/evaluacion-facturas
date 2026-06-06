namespace GestionFactura.Infrastructure.Repositories;

using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using GestionFactura.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class InvoiceRepository : Repository<Invoice>, IInvoiceRepository
{
    public InvoiceRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Invoice>> GetFilteredAsync(string? invoiceNumber, DateTime? startDate, DateTime? endDate)
    {
        var query = _context.Invoices.AsNoTracking()
            .Include(i => i.Client)
            .Include(i => i.Seller)
            .AsQueryable();

        if (!string.IsNullOrEmpty(invoiceNumber))
            query = query.Where(i => i.InvoiceNumber.Contains(invoiceNumber));

        if (startDate.HasValue)
            query = query.Where(i => i.Date >= startDate.Value.Date);

        // Ajuste de fecha final para incluir el día completo
        if (endDate.HasValue)
            query = query.Where(i => i.Date < endDate.Value.Date.AddDays(1));

        return await query.OrderByDescending(i => i.Date).ToListAsync();
    }

    public async Task<Invoice?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Invoices
            .Include(i => i.Client)
            .Include(i => i.Seller)
            .Include(i => i.Details)
            .ThenInclude(d => d.Product)
            .FirstOrDefaultAsync(i => i.Id == id);
    }
}

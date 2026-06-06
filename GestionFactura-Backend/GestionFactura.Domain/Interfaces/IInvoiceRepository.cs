namespace GestionFactura.Domain.Interfaces;

using GestionFactura.Domain.Entities;

public interface IInvoiceRepository : IRepository<Invoice>
{
    Task<IEnumerable<Invoice>> GetFilteredAsync(string? invoiceNumber, DateTime? startDate, DateTime? endDate);
    Task<Invoice?> GetByIdWithDetailsAsync(int id);
}

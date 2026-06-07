namespace GestionFactura.Api.Controllers;

using GestionFactura.Api.DTOs;
using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

using GestionFactura.Infrastructure.Data;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IRepository<Invoice> _invoiceRepo;
    private readonly IRepository<CompanyConfig> _configRepo;
    private readonly ApplicationDbContext _context;

    public InvoicesController(IRepository<Invoice> invoiceRepo, IRepository<CompanyConfig> configRepo, ApplicationDbContext context)
    {
        _invoiceRepo = invoiceRepo;
        _configRepo = configRepo;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetInvoices()
    {
        var invoices = await _context.Invoices
            .Include(i => i.Client)
            .ToListAsync();
        
        var summaries = invoices.Select(i => new InvoiceSummaryDto
        {
            Id = i.Id,
            InvoiceNumber = i.InvoiceNumber,
            Date = i.Date,
            ClientName = i.Client?.Name ?? "Consumidor Final",
            Status = i.Status,
            Total = i.Total
        }).OrderByDescending(i => i.Id);

        return Ok(summaries);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInvoice(int id)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Client)
            .Include(i => i.Seller)
            .Include(i => i.Details)
            .FirstOrDefaultAsync(i => i.Id == id);
            
        if (invoice == null) return NotFound("Factura no encontrada.");
        return Ok(invoice);
    }

    [HttpPost]
    public async Task<IActionResult> CreateInvoice([FromBody] InvoiceCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Obtener SellerId del Token
        var sellerIdClaim = User.FindFirst("id")?.Value;
        if (!int.TryParse(sellerIdClaim, out int sellerId))
        {
            return Unauthorized("Usuario no válido.");
        }

        // Generar Número de Factura simple (ej: F-000001)
        var allInvoices = await _invoiceRepo.GetAllAsync();
        int nextId = allInvoices.Count() + 1;
        string invoiceNumber = $"F-{nextId:D6}";

        var invoice = new Invoice
        {
            InvoiceNumber = invoiceNumber,
            Date = DateTime.UtcNow,
            ClientId = dto.ClientId,
            SellerId = sellerId,
            Status = "Pagada", // Por defecto pagada si es factura directa
            PaymentMethod = dto.PaymentMethod,
            Subtotal = dto.Subtotal,
            Tax = dto.Tax,
            Total = dto.Total,
            Details = dto.Details.Select(d => new InvoiceDetail
            {
                ProductId = d.ProductId,
                ProductCode = d.ProductCode,
                Description = d.Description,
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice,
                TotalPrice = d.TotalPrice
            }).ToList()
        };

        await _invoiceRepo.AddAsync(invoice);

        return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInvoice(int id, [FromBody] InvoiceCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var invoice = await _context.Invoices
            .Include(i => i.Details)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null) return NotFound("Factura no encontrada.");

        invoice.ClientId = dto.ClientId;
        invoice.PaymentMethod = dto.PaymentMethod;
        invoice.Subtotal = dto.Subtotal;
        invoice.Tax = dto.Tax;
        invoice.Total = dto.Total;

        // Limpiar detalles viejos e insertar los nuevos
        _context.InvoiceDetails.RemoveRange(invoice.Details);
        invoice.Details = dto.Details.Select(d => new InvoiceDetail
        {
            ProductId = d.ProductId,
            ProductCode = d.ProductCode,
            Description = d.Description,
            Quantity = d.Quantity,
            UnitPrice = d.UnitPrice,
            TotalPrice = d.TotalPrice
        }).ToList();

        await _context.SaveChangesAsync();

        return Ok(invoice);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvoice(int id)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null) return NotFound();

        await _invoiceRepo.DeleteAsync(id);
        return NoContent();
    }
}

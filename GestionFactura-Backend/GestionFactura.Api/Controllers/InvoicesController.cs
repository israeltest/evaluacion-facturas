namespace GestionFactura.Api.Controllers;

using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceRepository _invoiceRepo;

    public InvoicesController(IInvoiceRepository invoiceRepo)
    {
        _invoiceRepo = invoiceRepo;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? invoiceNumber, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var invoices = await _invoiceRepo.GetFilteredAsync(invoiceNumber, startDate, endDate);
        return Ok(invoices);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var invoice = await _invoiceRepo.GetByIdWithDetailsAsync(id);
        if (invoice == null) return NotFound();
        return Ok(invoice);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Invoice invoice)
    {
        invoice.Date = DateTime.UtcNow;
        
        if (string.IsNullOrEmpty(invoice.InvoiceNumber))
        {
            invoice.InvoiceNumber = "FAC-" + DateTime.Now.Ticks.ToString().Substring(10);
        }
        
        var created = await _invoiceRepo.AddAsync(invoice);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}

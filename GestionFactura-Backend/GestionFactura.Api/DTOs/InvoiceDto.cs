namespace GestionFactura.Api.DTOs;

using System.ComponentModel.DataAnnotations;

public class InvoiceDetailDto
{
    public int? ProductId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string ProductCode { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;
    
    [Range(1, 1000000)]
    public int Quantity { get; set; }
    
    [Range(0.01, 1000000)]
    public decimal UnitPrice { get; set; }
    
    public decimal TotalPrice { get; set; }
}

public class InvoiceCreateDto
{
    [Required]
    public int ClientId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "Efectivo";

    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "La factura debe tener al menos un detalle")]
    public List<InvoiceDetailDto> Details { get; set; } = new List<InvoiceDetailDto>();
}

// Para listar en la tabla (no tan pesado)
public class InvoiceSummaryDto
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Total { get; set; }
}

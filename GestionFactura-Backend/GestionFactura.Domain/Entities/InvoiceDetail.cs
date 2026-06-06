namespace GestionFactura.Domain.Entities;

public class InvoiceDetail
{
    public int Id { get; set; }
    
    public int InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;

    // lo dejamos nullable por si el producto se borra o algo asi
    public int? ProductId { get; set; }
    public Product? Product { get; set; }

    public string ProductCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

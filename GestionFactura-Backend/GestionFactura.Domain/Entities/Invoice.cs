namespace GestionFactura.Domain.Entities;

public class Invoice
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    
    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;

    public int SellerId { get; set; }
    public User Seller { get; set; } = null!;

    public string Status { get; set; } = "Pendiente"; 

    public string PaymentMethod { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }

    public ICollection<InvoiceDetail> Details { get; set; } = new List<InvoiceDetail>();
}

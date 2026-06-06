namespace GestionFactura.Domain.Entities;

public class CompanyConfig
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    
    // config de la base para calculos
    public decimal TaxPercentage { get; set; }
    public string CurrencySymbol { get; set; } = string.Empty;
    
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
}

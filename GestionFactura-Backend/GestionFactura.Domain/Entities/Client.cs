namespace GestionFactura.Domain.Entities;

public class Client
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    
    // todos nacen activos por defecto
    public bool IsActive { get; set; } = true;
    public DateTime DateAdded { get; set; } = DateTime.UtcNow;
}

namespace GestionFactura.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    
    // fecha en la que se creo en el sistema
    public DateTime DateAdded { get; set; } = DateTime.UtcNow;
}

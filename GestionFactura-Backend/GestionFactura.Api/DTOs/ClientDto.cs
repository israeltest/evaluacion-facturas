namespace GestionFactura.Api.DTOs;

using System.ComponentModel.DataAnnotations;

public class ClientDto
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Debe ser un correo válido")]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}

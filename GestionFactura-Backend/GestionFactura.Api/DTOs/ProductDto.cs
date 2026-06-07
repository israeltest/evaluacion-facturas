namespace GestionFactura.Api.DTOs;

using System.ComponentModel.DataAnnotations;

public class ProductDto
{
    [Required(ErrorMessage = "El código es obligatorio")]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre es obligatorio")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El precio es obligatorio")]
    [Range(0.01, 1000000, ErrorMessage = "El precio debe ser mayor a 0")]
    public decimal Price { get; set; }

    public bool IsActive { get; set; } = true;
}

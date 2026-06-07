namespace GestionFactura.Api.Controllers;

using GestionFactura.Api.DTOs;
using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IRepository<Product> _productRepo;

    public ProductsController(IRepository<Product> productRepo)
    {
        _productRepo = productRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        // Se traen solo los activos por defecto
        var products = await _productRepo.GetAllAsync();
        return Ok(products.Where(p => p.IsActive).OrderByDescending(p => p.Id));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _productRepo.GetByIdAsync(id);
        if (product == null) return NotFound("Producto no encontrado.");
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] ProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var newProduct = new Product
        {
            Code = dto.Code,
            Name = dto.Name,
            Price = dto.Price,
            IsActive = true,
            DateAdded = DateTime.UtcNow
        };

        await _productRepo.AddAsync(newProduct);
        return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto dto)
    {
        var product = await _productRepo.GetByIdAsync(id);
        if (product == null) return NotFound("Producto no encontrado.");

        product.Code = dto.Code;
        product.Name = dto.Name;
        product.Price = dto.Price;
        product.IsActive = dto.IsActive;

        await _productRepo.UpdateAsync(product);
        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _productRepo.GetByIdAsync(id);
        if (product == null) return NotFound("Producto no encontrado.");

        // Borrado lógico
        product.IsActive = false;
        await _productRepo.UpdateAsync(product);

        return Ok(new { message = "Producto desactivado correctamente." });
    }
}

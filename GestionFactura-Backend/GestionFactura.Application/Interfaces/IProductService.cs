namespace GestionFactura.Application.Interfaces;

using GestionFactura.Domain.Entities;

public interface IProductService
{
    Task<IEnumerable<Product>> GetAllActiveAsync();
    Task<Product?> GetByIdAsync(int id);
    Task<Product> CreateAsync(Product product);
    Task UpdateAsync(int id, Product product);
    Task DeleteLogicAsync(int id);
}

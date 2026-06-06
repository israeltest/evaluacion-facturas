namespace GestionFactura.Application.Services;

using GestionFactura.Application.Interfaces;
using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;

public class ProductService : IProductService
{
    private readonly IRepository<Product> _productRepo;

    public ProductService(IRepository<Product> productRepo)
    {
        _productRepo = productRepo;
    }

    public async Task<IEnumerable<Product>> GetAllActiveAsync()
    {
        var products = await _productRepo.GetAllAsync();
        return products.Where(p => p.IsActive);
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _productRepo.GetByIdAsync(id);
    }

    public async Task<Product> CreateAsync(Product product)
    {
        product.DateAdded = DateTime.UtcNow;
        product.IsActive = true;
        return await _productRepo.AddAsync(product);
    }

    public async Task UpdateAsync(int id, Product product)
    {
        if (id != product.Id) throw new ArgumentException("Id no coincide");
        await _productRepo.UpdateAsync(product);
    }

    public async Task DeleteLogicAsync(int id)
    {
        var product = await _productRepo.GetByIdAsync(id);
        if (product != null)
        {
            product.IsActive = false;
            await _productRepo.UpdateAsync(product);
        }
    }
}

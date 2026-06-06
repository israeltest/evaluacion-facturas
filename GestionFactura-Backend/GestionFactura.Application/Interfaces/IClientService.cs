namespace GestionFactura.Application.Interfaces;

using GestionFactura.Domain.Entities;

public interface IClientService
{
    Task<IEnumerable<Client>> GetAllActiveAsync();
    Task<Client?> GetByIdAsync(int id);
    Task<Client> CreateAsync(Client client);
    Task UpdateAsync(int id, Client client);
    Task DeleteLogicAsync(int id);
}

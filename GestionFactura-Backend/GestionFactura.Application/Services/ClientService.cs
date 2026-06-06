namespace GestionFactura.Application.Services;

using GestionFactura.Application.Interfaces;
using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;

public class ClientService : IClientService
{
    private readonly IRepository<Client> _clientRepo;

    public ClientService(IRepository<Client> clientRepo)
    {
        _clientRepo = clientRepo;
    }

    public async Task<IEnumerable<Client>> GetAllActiveAsync()
    {
        var clients = await _clientRepo.GetAllAsync();
        return clients.Where(c => c.IsActive);
    }

    public async Task<Client?> GetByIdAsync(int id)
    {
        return await _clientRepo.GetByIdAsync(id);
    }

    public async Task<Client> CreateAsync(Client client)
    {
        client.DateAdded = DateTime.UtcNow;
        client.IsActive = true;
        return await _clientRepo.AddAsync(client);
    }

    public async Task UpdateAsync(int id, Client client)
    {
        if (id != client.Id) throw new ArgumentException("Id no coincide");
        await _clientRepo.UpdateAsync(client);
    }

    public async Task DeleteLogicAsync(int id)
    {
        var client = await _clientRepo.GetByIdAsync(id);
        if (client != null)
        {
            client.IsActive = false;
            await _clientRepo.UpdateAsync(client);
        }
    }
}

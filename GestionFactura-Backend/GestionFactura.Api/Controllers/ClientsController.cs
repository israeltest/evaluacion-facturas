namespace GestionFactura.Api.Controllers;

using GestionFactura.Api.DTOs;
using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly IRepository<Client> _clientRepo;

    public ClientsController(IRepository<Client> clientRepo)
    {
        _clientRepo = clientRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetClients()
    {
        // activos por defecto (borrado lógico)
        var clients = await _clientRepo.GetAllAsync();
        return Ok(clients.Where(c => c.IsActive).OrderByDescending(c => c.Id));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetClient(int id)
    {
        var client = await _clientRepo.GetByIdAsync(id);
        if (client == null) return NotFound("Cliente no encontrado.");
        return Ok(client);
    }

    [HttpPost]
    public async Task<IActionResult> CreateClient([FromBody] ClientDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var newClient = new Client
        {
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            Address = dto.Address,
            IsActive = true,
            DateAdded = DateTime.UtcNow
        };

        await _clientRepo.AddAsync(newClient);
        return CreatedAtAction(nameof(GetClient), new { id = newClient.Id }, newClient);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(int id, [FromBody] ClientDto dto)
    {
        var client = await _clientRepo.GetByIdAsync(id);
        if (client == null) return NotFound("Cliente no encontrado.");

        client.Name = dto.Name;
        client.Phone = dto.Phone;
        client.Email = dto.Email;
        client.Address = dto.Address;
        client.IsActive = dto.IsActive;

        await _clientRepo.UpdateAsync(client);
        return Ok(client);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClient(int id)
    {
        var client = await _clientRepo.GetByIdAsync(id);
        if (client == null) return NotFound("Cliente no encontrado.");

        client.IsActive = false;
        await _clientRepo.UpdateAsync(client);

        return Ok(new { message = "Cliente desactivado correctamente." });
    }
}

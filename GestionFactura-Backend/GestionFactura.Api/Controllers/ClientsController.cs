namespace GestionFactura.Api.Controllers;

using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly GestionFactura.Application.Interfaces.IClientService _clientService;

    public ClientsController(GestionFactura.Application.Interfaces.IClientService clientService)
    {
        _clientService = clientService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var clients = await _clientService.GetAllActiveAsync();
        // solo devolvemos los activos.
        return Ok(clients);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var client = await _clientService.GetByIdAsync(id);
        if (client == null) return NotFound();
        return Ok(client);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Client client)
    {
        var created = await _clientService.CreateAsync(client);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Client client)
    {
        try 
        {
            await _clientService.UpdateAsync(id, client);
            return NoContent();
        } 
        catch 
        {
            return BadRequest();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _clientService.DeleteLogicAsync(id);
        return NoContent();
    }
}

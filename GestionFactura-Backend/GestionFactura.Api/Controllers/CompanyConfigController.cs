namespace GestionFactura.Api.Controllers;

using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Endpoint protegido para que solo usuarios logueados lo vean
public class CompanyConfigController : ControllerBase
{
    private readonly IRepository<CompanyConfig> _configRepo;

    public CompanyConfigController(IRepository<CompanyConfig> configRepo)
    {
        _configRepo = configRepo;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var configs = await _configRepo.GetAllAsync();
        var config = configs.FirstOrDefault();
        
        if (config == null) 
            return NotFound(new { message = "No hay configuracion activa" });
            
        return Ok(config);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] CompanyConfig updatedConfig)
    {
        if (id != updatedConfig.Id) 
            return BadRequest();
        
        await _configRepo.UpdateAsync(updatedConfig);
        return NoContent();
    }
}

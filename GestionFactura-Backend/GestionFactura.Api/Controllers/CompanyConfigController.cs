namespace GestionFactura.Api.Controllers;

using GestionFactura.Api.DTOs;
using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CompanyConfigController : ControllerBase
{
    private readonly IRepository<CompanyConfig> _configRepo;

    public CompanyConfigController(IRepository<CompanyConfig> configRepo)
    {
        _configRepo = configRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetConfig()
    {
        var configs = await _configRepo.GetAllAsync();
        var currentConfig = configs.FirstOrDefault();

        if (currentConfig == null)
        {
            // Retorna configuración por defecto sugerida (13% tax)
            return Ok(new CompanyConfigDto 
            { 
                TaxPercentage = 13,
                CurrencySymbol = "$"
            });
        }

        return Ok(new CompanyConfigDto
        {
            CompanyName = currentConfig.CompanyName,
            Phone = currentConfig.Phone,
            Email = currentConfig.Email,
            TaxPercentage = currentConfig.TaxPercentage,
            CurrencySymbol = currentConfig.CurrencySymbol,
            Address = currentConfig.Address,
            City = currentConfig.City,
            Region = currentConfig.Region,
            PostalCode = currentConfig.PostalCode
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateConfig([FromBody] CompanyConfigDto dto)
    {
        var configs = await _configRepo.GetAllAsync();
        var currentConfig = configs.FirstOrDefault();

        if (currentConfig == null)
        {
            // Creamos por primera vez
            currentConfig = new CompanyConfig
            {
                CompanyName = dto.CompanyName,
                Phone = dto.Phone,
                Email = dto.Email,
                TaxPercentage = dto.TaxPercentage,
                CurrencySymbol = dto.CurrencySymbol,
                Address = dto.Address,
                City = dto.City,
                Region = dto.Region,
                PostalCode = dto.PostalCode
            };
            await _configRepo.AddAsync(currentConfig);
        }
        else
        {
            // Actualizamos
            currentConfig.CompanyName = dto.CompanyName;
            currentConfig.Phone = dto.Phone;
            currentConfig.Email = dto.Email;
            currentConfig.TaxPercentage = dto.TaxPercentage;
            currentConfig.CurrencySymbol = dto.CurrencySymbol;
            currentConfig.Address = dto.Address;
            currentConfig.City = dto.City;
            currentConfig.Region = dto.Region;
            currentConfig.PostalCode = dto.PostalCode;
            
            await _configRepo.UpdateAsync(currentConfig);
        }

        return Ok(new { message = "Configuración actualizada correctamente" });
    }
}

namespace GestionFactura.Api.Controllers;

using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IRepository<User> _userRepo;

    public UsersController(IRepository<User> userRepo)
    {
        _userRepo = userRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userRepo.GetAllAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] User user)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Ojo: en un sistema real la contraseña debe ir hasheada.
        // Por simplicidad, aquí se guarda la contraseña directamente.
        user.DateAdded = DateTime.UtcNow;
        await _userRepo.AddAsync(user);
        return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
    {
        var user = await _userRepo.GetByIdAsync(id);
        if (user == null) return NotFound("Usuario no encontrado");

        user.Nombres = updatedUser.Nombres;
        user.Apellidos = updatedUser.Apellidos;
        user.Username = updatedUser.Username;
        user.Email = updatedUser.Email;
        
        if (!string.IsNullOrEmpty(updatedUser.PasswordHash))
        {
            user.PasswordHash = updatedUser.PasswordHash;
        }

        await _userRepo.UpdateAsync(user);
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        if (user == null) return NotFound("Usuario no encontrado");

        await _userRepo.DeleteAsync(id);
        return NoContent();
    }
}

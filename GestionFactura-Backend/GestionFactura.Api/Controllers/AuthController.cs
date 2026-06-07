namespace GestionFactura.Api.Controllers;

using GestionFactura.Api.DTOs;
using GestionFactura.Domain.Entities;
using GestionFactura.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IRepository<User> _userRepository;
    private readonly IConfiguration _config;

    public AuthController(IRepository<User> userRepository, IConfiguration config)
    {
        _userRepository = userRepository;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto login)
    {
        var users = await _userRepository.GetAllAsync();
        
        var user = users.FirstOrDefault(u => u.Username == login.Username && u.PasswordHash == login.Password);

        if (user == null)
            return Unauthorized(new { message = "Usuario o contraseña incorrectos" });

        var token = GenerateJwtToken(user);
        return Ok(new { token, username = user.Username, userId = user.Id });
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim("id", user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var horasExpiracion = double.TryParse(_config["Jwt:HorasExpiracion"], out var horas) ? horas : 1;

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(horasExpiracion),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

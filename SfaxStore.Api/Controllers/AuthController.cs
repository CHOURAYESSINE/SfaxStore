using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Data;
using SfaxStore.Api.Dtos;
using SfaxStore.Api.Models;

namespace SfaxStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(SfaxStoreDbContext db) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(item =>
            item.Email.ToLower() == request.Email.ToLower() && item.Password == request.Password);

        if (user is null)
        {
            return Unauthorized(new AuthResponse(false, "Invalid email or password.", null, null));
        }

        if (!user.Active)
        {
            return Unauthorized(new AuthResponse(false, "This account is disabled.", null, null));
        }

        var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        return Ok(new AuthResponse(true, "Successfully signed in.", new
        {
            user.Id,
            Name = user.FullName,
            user.Email,
            user.Role,
            user.Active,
            user.CreatedAt
        }, token));
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new AuthResponse(false, "Name, email and password are required.", null, null));
        }

        var email = request.Email.Trim().ToLower();
        var emailExists = await db.Users.AnyAsync(user => user.Email.ToLower() == email);
        if (emailExists)
        {
            return Conflict(new AuthResponse(false, "An account with this email already exists.", null, null));
        }

        var user = new AppUser
        {
            FullName = request.Name.Trim(),
            Email = request.Email.Trim(),
            Password = request.Password,
            Role = "USER",
            Active = true,
            CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        return CreatedAtAction(nameof(Register), new { id = user.Id }, new AuthResponse(true, "Account created successfully.", new
        {
            user.Id,
            Name = user.FullName,
            user.Email,
            user.Role,
            user.Active,
            user.CreatedAt
        }, token));
    }
}

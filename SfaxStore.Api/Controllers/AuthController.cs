using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Data;
using SfaxStore.Api.Dtos;

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
}

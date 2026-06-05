using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Data;
using SfaxStore.Api.Dtos;

namespace SfaxStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(SfaxStoreDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await db.Users
            .Select(user => new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.Active,
                user.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPut("{id:int}/role")]
    public async Task<IActionResult> UpdateRole(int id, UserRoleRequest request)
    {
        var role = request.Role.ToUpper();
        if (role is not ("ADMIN" or "USER"))
        {
            return BadRequest("Role must be ADMIN or USER.");
        }

        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        user.Role = role;
        await db.SaveChangesAsync();
        return Ok(new { user.Id, user.FullName, user.Email, user.Role, user.Active, user.CreatedAt });
    }

    [HttpPut("{id:int}/active")]
    public async Task<IActionResult> ToggleActive(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        user.Active = !user.Active;
        await db.SaveChangesAsync();
        return Ok(new { user.Id, user.FullName, user.Email, user.Role, user.Active, user.CreatedAt });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

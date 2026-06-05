using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Data;
using SfaxStore.Api.Dtos;

namespace SfaxStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(SfaxStoreDbContext db) : ControllerBase
{
    private static readonly HashSet<string> ValidStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await db.Orders
            .Include(order => order.User)
            .Include(order => order.Items)
            .ThenInclude(item => item.Product)
            .OrderByDescending(order => order.CreatedAt)
            .Select(order => new
            {
                order.Id,
                order.UserId,
                User = order.User == null ? null : new { order.User.Id, order.User.FullName, order.User.Email, order.User.Role },
                order.TotalAmount,
                order.Status,
                order.CreatedAt,
                Items = order.Items.Select(item => new
                {
                    item.Id,
                    item.ProductId,
                    Product = item.Product == null ? null : new { item.Product.Id, item.Product.Name, item.Product.ImageUrl },
                    item.Quantity,
                    item.UnitPrice
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, OrderStatusRequest request)
    {
        var normalizedStatus = request.Status.ToUpper();
        if (!ValidStatuses.Contains(normalizedStatus))
        {
            return BadRequest("Invalid order status.");
        }

        var order = await db.Orders.FindAsync(id);
        if (order is null)
        {
            return NotFound();
        }

        order.Status = normalizedStatus;
        await db.SaveChangesAsync();
        return Ok(order);
    }
}

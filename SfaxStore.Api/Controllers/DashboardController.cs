using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Data;

namespace SfaxStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(SfaxStoreDbContext db) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var products = await db.Products.Include(product => product.Category).ToListAsync();
        var orders = await db.Orders.Include(order => order.User).ToListAsync();
        var users = await db.Users.ToListAsync();
        var currentMonth = DateTime.UtcNow.Month;

        return Ok(new
        {
            totalProducts = products.Count,
            totalCategories = await db.Categories.CountAsync(),
            totalOrders = orders.Count,
            totalUsers = users.Count,
            totalRevenue = orders.Sum(order => order.TotalAmount),
            monthlyOrders = orders.Count(order => order.CreatedAt.Month == currentMonth),
            lowStockProducts = products.Count(product => product.Stock <= 5),
            topProducts = products.OrderByDescending(product => product.Sold).Take(5).Select(product => new
            {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.Stock,
                product.ImageUrl,
                product.CategoryId,
                Category = product.Category == null ? null : new { product.Category.Id, product.Category.Name },
                product.CreatedAt,
                product.Sold
            }),
            recentOrders = orders.OrderByDescending(order => order.CreatedAt).Take(5).Select(order => new
            {
                order.Id,
                order.UserId,
                User = order.User == null ? null : new { order.User.Id, order.User.FullName, order.User.Email, order.User.Role },
                order.TotalAmount,
                order.Status,
                order.CreatedAt
            })
        });
    }

    [HttpGet("orders-by-month")]
    public async Task<IActionResult> GetOrdersByMonth()
    {
        var orders = await db.Orders.ToListAsync();
        return Ok(Months().Select(month => new
        {
            label = month,
            value = orders.Count(order => order.CreatedAt.ToString("yyyy-MM") == month)
        }));
    }

    [HttpGet("products-by-category")]
    public async Task<IActionResult> GetProductsByCategory()
    {
        var categories = await db.Categories.Include(category => category.Products).ToListAsync();
        return Ok(categories.Select(category => new
        {
            category = category.Name,
            value = category.Products.Count
        }));
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue()
    {
        var orders = await db.Orders.ToListAsync();
        return Ok(Months().Select(month => new
        {
            label = month,
            value = orders
                .Where(order => order.CreatedAt.ToString("yyyy-MM") == month)
                .Sum(order => order.TotalAmount)
        }));
    }

    [HttpGet("orders-by-status")]
    public async Task<IActionResult> GetOrdersByStatus()
    {
        var orders = await db.Orders.ToListAsync();
        var statuses = new[] { "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED" };
        return Ok(statuses.Select(status => new
        {
            category = status,
            value = orders.Count(order => order.Status == status)
        }));
    }

    private static IEnumerable<string> Months()
    {
        return ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
    }
}

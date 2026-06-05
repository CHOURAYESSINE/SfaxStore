using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Data;
using SfaxStore.Api.Dtos;
using SfaxStore.Api.Models;

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

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await db.Orders
            .Include(item => item.User)
            .Include(item => item.Items)
            .ThenInclude(item => item.Product)
            .FirstOrDefaultAsync(item => item.Id == id);

        return order is null
            ? NotFound()
            : Ok(new
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
            });
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
    {
        if (request.Items.Count == 0)
        {
            return BadRequest("Order must contain at least one product.");
        }

        var user = await db.Users.FindAsync(request.UserId);
        if (user is null)
        {
            return BadRequest("User does not exist.");
        }

        var productIds = request.Items.Select(item => item.ProductId).Distinct().ToList();
        var products = await db.Products.Where(product => productIds.Contains(product.Id)).ToListAsync();

        foreach (var item in request.Items)
        {
            var product = products.FirstOrDefault(product => product.Id == item.ProductId);
            if (product is null)
            {
                return BadRequest($"Product {item.ProductId} does not exist.");
            }

            if (item.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0.");
            }

            if (product.Stock < item.Quantity)
            {
                return BadRequest($"Insufficient stock for {product.Name}. Available: {product.Stock}.");
            }
        }

        var subtotal = request.Items.Sum(item =>
        {
            var product = products.First(product => product.Id == item.ProductId);
            return product.Price * item.Quantity;
        });
        var total = Math.Max(0, subtotal - request.GiftCardDiscount);

        var order = new Order
        {
            UserId = request.UserId,
            TotalAmount = total,
            Status = "PENDING",
            CreatedAt = DateTime.UtcNow,
            Items = request.Items.Select(item =>
            {
                var product = products.First(product => product.Id == item.ProductId);
                product.Stock -= item.Quantity;
                product.Sold += item.Quantity;
                return new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };
            }).ToList()
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, new
        {
            order.Id,
            order.UserId,
            order.TotalAmount,
            order.Status,
            order.CreatedAt,
            Items = order.Items.Select(item => new
            {
                item.ProductId,
                item.Quantity,
                item.UnitPrice
            })
        });
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

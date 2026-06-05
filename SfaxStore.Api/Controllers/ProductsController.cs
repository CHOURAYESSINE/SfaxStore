using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Data;
using SfaxStore.Api.Dtos;
using SfaxStore.Api.Models;

namespace SfaxStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(SfaxStoreDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts([FromQuery] string? search, [FromQuery] int? categoryId)
    {
        var query = db.Products.Include(product => product.Category).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(product =>
                product.Name.ToLower().Contains(term) ||
                product.Description.ToLower().Contains(term));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(product => product.CategoryId == categoryId.Value);
        }

        return Ok((await query.ToListAsync()).Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await db.Products.Include(item => item.Category).FirstOrDefaultAsync(item => item.Id == id);
        return product is null ? NotFound() : Ok(ToDto(product));
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(ProductRequest request)
    {
        if (!await db.Categories.AnyAsync(category => category.Id == request.CategoryId))
        {
            return BadRequest("Category does not exist.");
        }

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            ImageUrl = request.ImageUrl,
            CategoryId = request.CategoryId,
            CreatedAt = DateTime.UtcNow,
        };

        db.Products.Add(product);
        await db.SaveChangesAsync();
        await db.Entry(product).Reference(item => item.Category).LoadAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, ToDto(product));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, ProductRequest request)
    {
        var product = await db.Products.Include(item => item.Category).FirstOrDefaultAsync(item => item.Id == id);
        if (product is null)
        {
            return NotFound();
        }

        if (!await db.Categories.AnyAsync(category => category.Id == request.CategoryId))
        {
            return BadRequest("Category does not exist.");
        }

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.ImageUrl = request.ImageUrl;
        product.CategoryId = request.CategoryId;
        await db.SaveChangesAsync();
        await db.Entry(product).Reference(item => item.Category).LoadAsync();

        return Ok(ToDto(product));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null)
        {
            return NotFound();
        }

        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static ProductDto ToDto(Product product)
    {
        return new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.Stock,
            product.ImageUrl,
            product.CategoryId,
            product.Category is null
                ? null
                : new CategoryDto(product.Category.Id, product.Category.Name, product.Category.Description, 0),
            product.CreatedAt,
            product.Sold);
    }
}

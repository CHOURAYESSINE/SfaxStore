using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Data;
using SfaxStore.Api.Dtos;
using SfaxStore.Api.Models;

namespace SfaxStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(SfaxStoreDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await db.Categories.Include(category => category.Products).ToListAsync();
        return Ok(categories.Select(ToDto));
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory(CategoryRequest request)
    {
        var category = new Category { Name = request.Name, Description = request.Description };
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, ToDto(category));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CategoryDto>> UpdateCategory(int id, CategoryRequest request)
    {
        var category = await db.Categories.Include(item => item.Products).FirstOrDefaultAsync(item => item.Id == id);
        if (category is null)
        {
            return NotFound();
        }

        category.Name = request.Name;
        category.Description = request.Description;
        await db.SaveChangesAsync();
        return Ok(ToDto(category));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await db.Categories.Include(item => item.Products).FirstOrDefaultAsync(item => item.Id == id);
        if (category is null)
        {
            return NotFound();
        }

        if (category.Products.Any())
        {
            return BadRequest("Cannot delete a category that contains products.");
        }

        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static CategoryDto ToDto(Category category)
    {
        return new CategoryDto(category.Id, category.Name, category.Description, category.Products.Count);
    }
}

using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Models;

namespace SfaxStore.Api.Data;

public class SfaxStoreDbContext(DbContextOptions<SfaxStoreDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>()
            .HasMany(category => category.Products)
            .WithOne(product => product.Category)
            .HasForeignKey(product => product.CategoryId);

        modelBuilder.Entity<AppUser>()
            .HasMany(user => user.Orders)
            .WithOne(order => order.User)
            .HasForeignKey(order => order.UserId);

        modelBuilder.Entity<Order>()
            .HasMany(order => order.Items)
            .WithOne(item => item.Order)
            .HasForeignKey(item => item.OrderId);

        modelBuilder.Entity<Product>()
            .Property(product => product.Price)
            .HasPrecision(10, 2);
        modelBuilder.Entity<Product>()
            .Property(product => product.CreatedAt)
            .HasColumnType("timestamp without time zone");

        modelBuilder.Entity<Order>()
            .Property(order => order.TotalAmount)
            .HasPrecision(10, 2);
        modelBuilder.Entity<Order>()
            .Property(order => order.CreatedAt)
            .HasColumnType("timestamp without time zone");

        modelBuilder.Entity<OrderItem>()
            .Property(item => item.UnitPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<AppUser>()
            .Property(user => user.CreatedAt)
            .HasColumnType("timestamp without time zone");
    }
}

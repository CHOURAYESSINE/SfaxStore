using SfaxStore.Api.Models;

namespace SfaxStore.Api.Data;

public static class SfaxStoreSeedData
{
    public static void Seed(SfaxStoreDbContext db)
    {
        if (db.Categories.Any())
        {
            return;
        }

        var categories = new[]
        {
            new Category { Id = 1, Name = "Computers", Description = "Laptops, desktops and workstations" },
            new Category { Id = 2, Name = "Accessories", Description = "Keyboards, mice and peripherals" },
            new Category { Id = 3, Name = "Gaming", Description = "Gaming gear and performance devices" },
            new Category { Id = 4, Name = "Smart Home", Description = "Connected devices and home automation" },
        };

        var products = new[]
        {
            new Product { Id = 1, Name = "Lenovo ThinkPad E15", Description = "Business laptop for students and professionals.", Price = 2450, Stock = 9, ImageUrl = "https://m.media-amazon.com/images/I/51O4bS147tL._AC_SL1000_.jpg", CategoryId = 1, CreatedAt = new DateTime(2026, 1, 10), Sold = 34 },
            new Product { Id = 2, Name = "Mechanical RGB Keyboard", Description = "Mechanical keyboard with customizable RGB lighting.", Price = 180, Stock = 18, ImageUrl = "https://m.media-amazon.com/images/I/51IQ2qI3cdL._AC_SL1000_.jpg", CategoryId = 2, CreatedAt = new DateTime(2026, 1, 18), Sold = 71 },
            new Product { Id = 3, Name = "Gaming Mouse 16K DPI", Description = "High precision gaming mouse with programmable buttons.", Price = 129, Stock = 4, ImageUrl = "https://m.media-amazon.com/images/I/613Viv-hcsL._AC_SL1500_.jpg", CategoryId = 3, CreatedAt = new DateTime(2026, 2, 2), Sold = 56 },
            new Product { Id = 4, Name = "Smart Speaker Mini", Description = "Compact speaker for music and home automation.", Price = 210, Stock = 2, ImageUrl = "https://m.media-amazon.com/images/I/71xoR4A6q-L._AC_SL1000_.jpg", CategoryId = 4, CreatedAt = new DateTime(2026, 2, 15), Sold = 22 },
        };

        var users = new[]
        {
            new AppUser { Id = 1, FullName = "Admin SfaxStore", Email = "admin@sfaxstore.tn", Password = "admin123", Role = "ADMIN", Active = true, CreatedAt = new DateTime(2026, 1, 1) },
            new AppUser { Id = 2, FullName = "Demo User", Email = "user@sfaxstore.tn", Password = "user123", Role = "USER", Active = true, CreatedAt = new DateTime(2026, 1, 5) },
            new AppUser { Id = 3, FullName = "Client Sfax", Email = "client@sfaxstore.tn", Password = "client123", Role = "USER", Active = true, CreatedAt = new DateTime(2026, 2, 12) },
        };

        var orders = new[]
        {
            new Order { Id = 1001, UserId = 2, TotalAmount = 2630, Status = "DELIVERED", CreatedAt = new DateTime(2026, 1, 21) },
            new Order { Id = 1002, UserId = 3, TotalAmount = 339, Status = "SHIPPED", CreatedAt = new DateTime(2026, 2, 18) },
            new Order { Id = 1003, UserId = 2, TotalAmount = 360, Status = "PENDING", CreatedAt = new DateTime(2026, 6, 1) },
        };

        var orderItems = new[]
        {
            new OrderItem { Id = 1, OrderId = 1001, ProductId = 1, Quantity = 1, UnitPrice = 2450 },
            new OrderItem { Id = 2, OrderId = 1001, ProductId = 2, Quantity = 1, UnitPrice = 180 },
            new OrderItem { Id = 3, OrderId = 1002, ProductId = 3, Quantity = 1, UnitPrice = 129 },
            new OrderItem { Id = 4, OrderId = 1002, ProductId = 4, Quantity = 1, UnitPrice = 210 },
            new OrderItem { Id = 5, OrderId = 1003, ProductId = 2, Quantity = 2, UnitPrice = 180 },
        };

        db.Categories.AddRange(categories);
        db.Products.AddRange(products);
        db.Users.AddRange(users);
        db.Orders.AddRange(orders);
        db.OrderItems.AddRange(orderItems);
        db.SaveChanges();
    }
}

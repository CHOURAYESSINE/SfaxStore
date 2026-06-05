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
            new Product { Id = 2, Name = "HP ProBook 450", Description = "Reliable office laptop with Intel Core processor.", Price = 2190, Stock = 11, ImageUrl = "https://laptopmedia.com/wp-content/uploads/2024/05/71WgOEH8L._AC_SL1500_-680x482.jpg", CategoryId = 1, CreatedAt = new DateTime(2026, 1, 12), Sold = 18 },
            new Product { Id = 3, Name = "Dell OptiPlex Desktop", Description = "Compact desktop for business and study use.", Price = 1850, Stock = 7, ImageUrl = "https://jakeson.net/wp-content/uploads/2025/02/dell-optiplex-7060-sff-desktop-computer-pc-intel-8th-gen-i7-8700-6-core-32gb-ddr4-ram-new-1tb-nvme-m2-ssd-built-in-wifi-.jpg", CategoryId = 1, CreatedAt = new DateTime(2026, 1, 15), Sold = 21 },
            new Product { Id = 4, Name = "ASUS VivoBook 15", Description = "Lightweight laptop with fast SSD storage.", Price = 1990, Stock = 14, ImageUrl = "https://m.media-amazon.com/images/I/71S8U9VzLTL._AC_SL1500_.jpg", CategoryId = 1, CreatedAt = new DateTime(2026, 1, 17), Sold = 26 },
            new Product { Id = 5, Name = "Acer Aspire Monitor Bundle", Description = "Desktop starter bundle with monitor and keyboard.", Price = 1520, Stock = 5, ImageUrl = "https://m.media-amazon.com/images/I/71rXSVqET9L._AC_SL1500_.jpg", CategoryId = 1, CreatedAt = new DateTime(2026, 1, 19), Sold = 15 },

            new Product { Id = 6, Name = "Mechanical RGB Keyboard", Description = "Mechanical keyboard with customizable RGB lighting.", Price = 180, Stock = 18, ImageUrl = "https://m.media-amazon.com/images/I/51IQ2qI3cdL._AC_SL1000_.jpg", CategoryId = 2, CreatedAt = new DateTime(2026, 1, 18), Sold = 71 },
            new Product { Id = 7, Name = "Wireless Office Mouse", Description = "Silent ergonomic mouse for daily productivity.", Price = 65, Stock = 35, ImageUrl = "https://m.media-amazon.com/images/I/61LtuGzXeaL._AC_SL1500_.jpg", CategoryId = 2, CreatedAt = new DateTime(2026, 1, 22), Sold = 48 },
            new Product { Id = 8, Name = "USB-C Docking Station", Description = "Multi-port docking station with HDMI and Ethernet.", Price = 240, Stock = 12, ImageUrl = "https://plugable.com/cdn/shop/files/main_ori_5568b3d7-debd-4682-846f-76882c0d2dc3.jpg?height=800&pad_color=fff&v=1777671370&width=800", CategoryId = 2, CreatedAt = new DateTime(2026, 1, 25), Sold = 30 },
            new Product { Id = 9, Name = "Laptop Stand Aluminum", Description = "Adjustable stand for better posture and cooling.", Price = 95, Stock = 22, ImageUrl = "https://m.media-amazon.com/images/I/61+Q6Rh3OQL._AC_SL1500_.jpg", CategoryId = 2, CreatedAt = new DateTime(2026, 1, 27), Sold = 37 },
            new Product { Id = 10, Name = "Noise Cancelling Headset", Description = "Comfortable headset for calls, classes and gaming.", Price = 310, Stock = 10, ImageUrl = "https://m.media-amazon.com/images/I/41X04H4flML._AC_SL1000_.jpg", CategoryId = 2, CreatedAt = new DateTime(2026, 1, 29), Sold = 25 },

            new Product { Id = 11, Name = "Gaming Mouse 16K DPI", Description = "High precision gaming mouse with programmable buttons.", Price = 129, Stock = 4, ImageUrl = "https://m.media-amazon.com/images/I/613Viv-hcsL._AC_SL1500_.jpg", CategoryId = 3, CreatedAt = new DateTime(2026, 2, 2), Sold = 56 },
            new Product { Id = 12, Name = "Gaming Chair Recliner", Description = "Ergonomic chair with reclining backrest.", Price = 590, Stock = 6, ImageUrl = "https://m.media-amazon.com/images/I/51JVlx47nfL._AC_SL1080_.jpg", CategoryId = 3, CreatedAt = new DateTime(2026, 2, 4), Sold = 19 },
            new Product { Id = 13, Name = "RTX Gaming Laptop", Description = "High-performance laptop for gaming and creation.", Price = 3890, Stock = 3, ImageUrl = "https://m.media-amazon.com/images/I/51O4bS147tL._AC_SL1000_.jpg", CategoryId = 3, CreatedAt = new DateTime(2026, 2, 8), Sold = 11 },
            new Product { Id = 14, Name = "27 Inch 165Hz Monitor", Description = "Fast gaming monitor with crisp image quality.", Price = 890, Stock = 8, ImageUrl = "https://m.media-amazon.com/images/I/71rXSVqET9L._AC_SL1500_.jpg", CategoryId = 3, CreatedAt = new DateTime(2026, 2, 10), Sold = 29 },
            new Product { Id = 15, Name = "RGB Gaming Headset", Description = "Immersive headset with microphone and RGB accent.", Price = 155, Stock = 16, ImageUrl = "https://m.media-amazon.com/images/I/41X04H4flML._AC_SL1000_.jpg", CategoryId = 3, CreatedAt = new DateTime(2026, 2, 14), Sold = 43 },

            new Product { Id = 16, Name = "Smart Speaker Mini", Description = "Compact speaker for music and home automation.", Price = 210, Stock = 2, ImageUrl = "https://m.media-amazon.com/images/I/71xoR4A6q-L._AC_SL1000_.jpg", CategoryId = 4, CreatedAt = new DateTime(2026, 2, 15), Sold = 22 },
            new Product { Id = 17, Name = "Wi-Fi Security Camera", Description = "Night vision camera with motion detection.", Price = 279, Stock = 13, ImageUrl = "https://m.media-amazon.com/images/I/41WQe9NiU6L._AC_SL1000_.jpg", CategoryId = 4, CreatedAt = new DateTime(2026, 2, 18), Sold = 36 },
            new Product { Id = 18, Name = "Smart LED Bulb Pack", Description = "Color smart bulbs controlled from mobile app.", Price = 120, Stock = 28, ImageUrl = "https://m.media-amazon.com/images/I/61eA9PkZ07L._AC_SL1500_.jpg", CategoryId = 4, CreatedAt = new DateTime(2026, 2, 21), Sold = 52 },
            new Product { Id = 19, Name = "Smart Plug Duo", Description = "Remote power control for home devices.", Price = 80, Stock = 25, ImageUrl = "https://images.prismic.io/kasasmart/ecaaf95b94a625df59ec5c28a4679e99f71df98f_hs105-product-image.png?auto=compress%2Cformat", CategoryId = 4, CreatedAt = new DateTime(2026, 2, 23), Sold = 44 },
            new Product { Id = 20, Name = "Video Doorbell", Description = "Smart doorbell with camera and phone alerts.", Price = 430, Stock = 7, ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/2/26/Ring_video_doorbell.jpg", CategoryId = 4, CreatedAt = new DateTime(2026, 2, 27), Sold = 17 },
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
            new OrderItem { Id = 2, OrderId = 1001, ProductId = 6, Quantity = 1, UnitPrice = 180 },
            new OrderItem { Id = 3, OrderId = 1002, ProductId = 11, Quantity = 1, UnitPrice = 129 },
            new OrderItem { Id = 4, OrderId = 1002, ProductId = 16, Quantity = 1, UnitPrice = 210 },
            new OrderItem { Id = 5, OrderId = 1003, ProductId = 6, Quantity = 2, UnitPrice = 180 },
        };

        db.Categories.AddRange(categories);
        db.Products.AddRange(products);
        db.Users.AddRange(users);
        db.Orders.AddRange(orders);
        db.OrderItems.AddRange(orderItems);
        db.SaveChanges();
    }
}

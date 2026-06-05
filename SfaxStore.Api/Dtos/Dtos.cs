namespace SfaxStore.Api.Dtos;

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Name, string Email, string Password);
public record AuthResponse(bool Success, string Message, object? User, string? Token);

public record CategoryDto(int Id, string Name, string? Description, int ProductsCount);
public record CategoryRequest(string Name, string? Description);

public record ProductDto(int Id, string Name, string Description, decimal Price, int Stock, string ImageUrl, int CategoryId, CategoryDto? Category, DateTime CreatedAt, int Sold);
public record ProductRequest(string Name, string Description, decimal Price, int Stock, string ImageUrl, int CategoryId);

public record OrderStatusRequest(string Status);
public record UserRoleRequest(string Role);

public record CreateOrderItemRequest(int ProductId, int Quantity);
public record CreateOrderRequest(int UserId, List<CreateOrderItemRequest> Items, decimal GiftCardDiscount = 0);

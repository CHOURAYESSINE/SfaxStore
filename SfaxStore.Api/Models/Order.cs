namespace SfaxStore.Api.Models;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public AppUser? User { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "PENDING";
    public DateTime CreatedAt { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

using Microsoft.EntityFrameworkCore;
using SfaxStore.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<SfaxStoreDbContext>(options =>
    options.UseInMemoryDatabase("SfaxStoreExamDb"));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
        policy
            .WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SfaxStoreDbContext>();
    SfaxStoreSeedData.Seed(db);
}

app.UseHttpsRedirection();
app.UseCors("AngularClient");

app.UseAuthorization();

app.MapControllers();

app.Run();

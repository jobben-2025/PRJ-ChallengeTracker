using MyProject.Server.Dtos;
using MyProject.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MyProject.Server.Api.Endpoints;

public static class AuthEndpoints 
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth");

        group.MapPost("/register", async (RegisterRequest req, AppDbContext db) => {
            // Registration logic...
            return Results.Ok();
        });

        group.MapPost("/login", async (LoginRequest req, AppDbContext db) => {
            // Login logic...
            return Results.Ok();
        });
    }
}
using MyProject.Server.Infrastructure;
using MyProject.Server.Models;
using MyProject.Server.Dtos;
using MyProject.Server.Application;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MyProject.Server.Api.Endpoints;

public static class AuthEndpoints {
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app) {
        var group = app.MapGroup("/auth");

        // FR005: Register
        group.MapPost("/register", async (RegisterRequest req, AppDbContext db) => {
            if (await db.Users.AnyAsync(u => u.Email == req.Email)) return Results.BadRequest("Email taken");
            var user = new User { Email = req.Email, DisplayName = req.DisplayName, PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password) };
            db.Users.Add(user);
            await db.SaveChangesAsync();
            return Results.Ok(new { user.Email, user.DisplayName });
        }).RequireRateLimiting("write");

        // FR005: Login
        group.MapPost("/login", async (LoginRequest req, AppDbContext db, AuthService auth) => {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash)) return Results.Unauthorized();
            return Results.Ok(new { Token = auth.GenerateToken(user.Id, user.Email), user.DisplayName, user.Email });
        }).RequireRateLimiting("write");

        // FR005: Me
        group.MapGet("/me", (ClaimsPrincipal user) => Results.Ok(new { 
            Id = user.FindFirstValue(ClaimTypes.NameIdentifier),
            Email = user.FindFirstValue(ClaimTypes.Email)
        })).RequireAuthorization();
    }
}
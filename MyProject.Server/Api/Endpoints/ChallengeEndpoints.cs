using MyProject.Server.Infrastructure;
using MyProject.Server.Models;
using MyProject.Server.Dtos;
using MyProject.Server.Common;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MyProject.Server.Api.Endpoints;

public static class ChallengeEndpoints {
    public static void MapChallengeEndpoints(this IEndpointRouteBuilder app) {
        var group = app.MapGroup("/challenges").RequireAuthorization();

        // FR006: Create
        group.MapPost("/", async (CreateChallengeRequest req, ClaimsPrincipal user, AppDbContext db) => {
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var challenge = new Challenge { Title = req.Title, Visibility = req.Visibility, OwnerId = userId, StartDate = req.StartDate, EndDate = req.EndDate };
            db.Challenges.Add(challenge);
            await db.SaveChangesAsync();
            return Results.Created($"/challenges/{challenge.Id}", challenge);
        }).RequireRateLimiting("write");

        // FR006: Read
        app.MapGet("/challenges", async (ChallengeVisibility? visibility, ChallengeStatus? status, AppDbContext db) => {
            var query = db.Challenges.AsQueryable();
            if (visibility.HasValue) query = query.Where(c => c.Visibility == visibility);
            if (status.HasValue) query = query.Where(c => c.Status == status);
            return await query.ToListAsync();
        }).AllowAnonymous();

        // FR007: Start/Complete (Transitions)
        group.MapPost("/{id}:start", async (int id, ClaimsPrincipal user, AppDbContext db) => {
            var challenge = await db.Challenges.FindAsync(id);
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (challenge == null || challenge.OwnerId != userId) return Results.Forbid();
            
            challenge.Status = ChallengeStatus.Running;
            await db.SaveChangesAsync();
            return Results.Ok();
        });
        
        // FR011: Leaderboard
        // app.MapGet("/leaderboards/challenges/{id}", async (int id, AppDbContext db) => {
        //     return await db.ProgressEntries
        //         .Where(p => p.ChallengeId == id)
        //         .Join(db.Users, p => p.UserId, u => u.Id, (p, u) => new { u.DisplayName, p.Amount })
        //         .GroupBy(x => x.DisplayName)
        //         .Select(g => new LeaderboardEntry(g.Key, g.Sum(x => x.Amount)))
        //         .OrderByDescending(x => x.TotalProgress)
        //         .ToListAsync();
        // }).AllowAnonymous();
        app.MapGet("/leaderboards/challenges/{id}", async (int id, AppDbContext db) => {
            var entries = await db.ProgressEntries
                .Where(p => p.ChallengeId == id)
                .Select(p => new {
                    // We reach through the relationship to get the User's name
                    Name = db.Users.Where(u => u.Id == p.UserId).Select(u => u.DisplayName).FirstOrDefault() ?? "Unknown",
                    p.Amount
                })
                .ToListAsync();

            var leaderboard = entries
                .GroupBy(x => x.Name)
                .Select(g => new LeaderboardEntry(g.Key, g.Sum(x => x.Amount)))
                .OrderByDescending(x => x.TotalProgress)
                .ToList();

            return Results.Ok(leaderboard);
        }).AllowAnonymous();
    }
}
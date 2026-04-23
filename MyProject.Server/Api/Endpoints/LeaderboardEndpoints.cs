using MyProject.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MyProject.Server.Api.Endpoints;

public static class LeaderboardEndpoints 
{
    public static void MapLeaderboardEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/leaderboards/challenges/{id}", async (Guid id, AppDbContext db) => 
        {
            var board = await db.ProgressEntries
                .Where(p => p.ChallengeId == id)
                .GroupBy(p => p.UserId)
                .Select(g => new { 
                    UserId = g.Key, 
                    Total = g.Sum(x => x.Amount) 
                })
                .OrderByDescending(x => x.Total)
                .ToListAsync();

            return Results.Ok(board);
        });
    }
}
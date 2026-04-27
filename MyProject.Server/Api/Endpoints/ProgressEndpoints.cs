using MyProject.Server.Infrastructure;
using MyProject.Server.Models;
using MyProject.Server.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MyProject.Server.Api.Endpoints;

public static class ProgressEndpoints {
    public static void MapProgressEndpoints(this IEndpointRouteBuilder app) {
        var group = app.MapGroup("/progress-entries").RequireAuthorization();

        // FR009: Logging
        group.MapPost("/", async (int challengeId, ProgressRequest req, ClaimsPrincipal user, AppDbContext db) => {
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var loggedAt = req.LoggedAt ?? DateTime.UtcNow;
            
            var challenge = await db.Challenges.FindAsync(challengeId);
            if (challenge == null) return Results.NotFound();
            
            // Rules: date window check
            if ((challenge.StartDate.HasValue && loggedAt < challenge.StartDate) || (challenge.EndDate.HasValue && loggedAt > challenge.EndDate))
                return Results.Problem("Logged date outside challenge window", statusCode: 400);

            // Rule: 1 entry per user per challenge per day
            var exists = await db.ProgressEntries.AnyAsync(p => p.UserId == userId && p.ChallengeId == challengeId && p.LoggedAt.Date == loggedAt.Date);
            if (exists) return Results.Problem("Daily entry already logged", statusCode: 400);

            var entry = new ProgressEntry { UserId = userId, ChallengeId = challengeId, Amount = req.Amount, Note = req.Note, LoggedAt = loggedAt };
            db.ProgressEntries.Add(entry);
            await db.SaveChangesAsync();
            return Results.Created($"/progress-entries/{entry.Id}", entry);
        }).RequireRateLimiting("progress");

        // FR010: Edits (24h rule)
        group.MapPatch("/{id}", async (int id, ProgressRequest req, ClaimsPrincipal user, AppDbContext db) => {
            var entry = await db.ProgressEntries.FindAsync(id);
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (entry == null || entry.UserId != userId) return Results.Forbid();
            if (DateTime.UtcNow > entry.CreatedAt.AddHours(24)) return Results.Problem("Edit period expired (24h)", statusCode: 400);
            
            entry.Amount = req.Amount;
            entry.Note = req.Note;
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
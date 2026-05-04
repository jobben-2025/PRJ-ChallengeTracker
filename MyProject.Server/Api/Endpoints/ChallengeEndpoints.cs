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

        // Adil Code 
        group.MapGet("/", async (AppDbContext db) => {
            return await db.Challenges
            .Include(c => c.ProgressEntries)// Adil Code 
            .ToListAsync(); 
        }).AllowAnonymous(); // Oder .RequireAuthorization() falls gewünscht

    // 2. Einzelne Challenge per ID (für deine Detailansicht)
        group.MapGet("/{id}", async (int id, AppDbContext db) => {
            var challenge = await db.Challenges
            //.Include(c => c.Owner) // Falls du den Ersteller anzeigen willst
            .FirstOrDefaultAsync(c => c.Id == id);

            return challenge is not null 
                ? Results.Ok(challenge) 
                : Results.NotFound(new { message = "Challenge nicht gefunden" });
            }).AllowAnonymous();


                                // PATCH: /challenges/{id}
                                // Adil Code 


    group.MapPatch("/{id:int}", async (int id, UpdateChallengeProgressRequest req, AppDbContext db) => {
            var challenge = await db.Challenges.FindAsync(id);
            if (challenge == null) return Results.NotFound();

            // 1. Eintrag speichern
            db.ProgressEntries.Add(new ProgressEntry {
                ChallengeId = id,
                Amount = req.NewTotal,
                LoggedAt = DateTime.UtcNow
            });

            // 2. Status permanent in der Datenbank ändern
            if (req.IsFinished) {
                challenge.Status = ChallengeStatus.Completed; // Setzt Status auf 2
            }

            await db.SaveChangesAsync();
            return Results.Ok();
    });

    // DELETE: /challenges/{id}
/*         group.MapDelete("/{id:int}", async (int id, ClaimsPrincipal user, AppDbContext db) => {
            var challenge = await db.Challenges.FindAsync(id);
            
            if (challenge == null) return Results.NotFound();

            // Optional: Prüfen, ob der User auch der Besitzer ist
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (challenge.OwnerId != userId) return Results.Forbid();

            db.Challenges.Remove(challenge);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }); */

        // Testweise ohne User und mit AllowAnonymous
app.MapDelete("/challenges/{id:int}", async (int id, AppDbContext db) => {
    var challenge = await db.Challenges.FindAsync(id);
    if (challenge == null) return Results.NotFound();
    db.Challenges.Remove(challenge);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).AllowAnonymous();

       
       
          // Adil Code Ende


        // FR006: Create
        group.MapPost("/", async (CreateChallengeRequest req, ClaimsPrincipal user, AppDbContext db) => {
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var challenge = new Challenge { Title = req.Title, Visibility = req.Visibility, OwnerId = userId, StartDate = req.StartDate, EndDate = req.EndDate };
            db.Challenges.Add(challenge);
            await db.SaveChangesAsync();
            return Results.Created($"/challenges/{challenge.Id}", challenge);
        }).RequireRateLimiting("write");

        // FR006: Read
        // Adil anpassen Code
         app.MapGet("/challenges/joined", async (ChallengeVisibility? visibility, ChallengeStatus? status, AppDbContext db) => {
            var query = db.Challenges.Include(c => c.ProgressEntries).AsQueryable();
            if (visibility.HasValue) query = query.Where(c => c.Visibility == visibility);
            if (status.HasValue) query = query.Where(c => c.Status == status);
            return await query.ToListAsync();
        }).AllowAnonymous();

 
        // Alter Code
/*         app.MapGet("/challenges", async (ChallengeVisibility? visibility, ChallengeStatus? status, AppDbContext db) => {
            var query = db.Challenges.AsQueryable();
            if (visibility.HasValue) query = query.Where(c => c.Visibility == visibility);
            if (status.HasValue) query = query.Where(c => c.Status == status);
            return await query.ToListAsync();
        }).AllowAnonymous(); */

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
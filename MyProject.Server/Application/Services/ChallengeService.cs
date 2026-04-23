using Microsoft.EntityFrameworkCore;
using MyProject.Server.Infrastructure.Data; // Adjust prefix if needed
using MyProject.Server.Models;
using MyProject.Server.Dtos;               // <--- Match this to the actual namespace

namespace MyProject.Server.Application.Services;

public class ChallengeService(AppDbContext db) {
    // FR007: Challenge State Transitions
    public async Task<IResult> StartChallenge(Guid id, Guid userId) {
        var challenge = await db.Challenges.FindAsync(id);
        if (challenge == null || challenge.OwnerId != userId) return Results.Forbid();
        if (challenge.Status != ChallengeStatus.Open) return Results.BadRequest("Only Open challenges can start.");
        
        challenge.Status = ChallengeStatus.Running;
        challenge.StartDate = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Results.Ok();
    }

    // FR009: Progress Logging Logic
    public async Task<IResult> LogProgress(Guid userId, Guid challengeId, ProgressRequest dto) {
        var challenge = await db.Challenges.FindAsync(challengeId);
        if (challenge?.Status != ChallengeStatus.Running) return Results.BadRequest("Challenge not running.");
        
        var isMember = await db.Memberships.AnyAsync(m => m.UserId == userId && m.ChallengeId == challengeId && m.IsActive);
        if (!isMember) return Results.BadRequest("Not an active member.");

        var logDate = (dto.LoggedAt ?? DateTime.UtcNow).Date;
        
        var entry = new ProgressEntry {
            UserId = userId,
            ChallengeId = challengeId,
            Amount = dto.Amount,
            Note = dto.Note,
            LoggedAt = logDate
        };

        db.ProgressEntries.Add(entry);
        try {
            await db.SaveChangesAsync();
            return Results.Created($"/progress/{entry.Id}", entry);
        } catch { return Results.Conflict("Entry for this day already exists."); }
    }
}
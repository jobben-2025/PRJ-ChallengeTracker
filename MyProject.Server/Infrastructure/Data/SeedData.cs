using MyProject.Server.Models;
using MyProject.Server.Infrastructure.Auth; // Assuming PasswordHasher is here

namespace MyProject.Server.Infrastructure.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext db)
    {
        // 1. Check if data already exists (FR004 condition)
        if (db.Users.Any() || db.Challenges.Any())
        {
            return; 
        }

        // 2. Seed Users (FR005)
        var devUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "dev@example.com",
            DisplayName = "Dev Veteran",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("P@ssword123")
        };

        var challenger = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@example.com",
            DisplayName = "Daily Reader",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("P@ssword123")
        };

        db.Users.AddRange(devUser, challenger);

        // 3. Seed a Public Challenge (FR004/FR006)
        var challenge = new Challenge
        {
            Id = Guid.NewGuid(),
            Title = "Read 100 pages this week",
            OwnerId = devUser.Id,
            Status = ChallengeStatus.Open,
            Visibility = ChallengeVisibility.Public,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(7)
        };

        db.Challenges.Add(challenge);

        // 4. Seed a Sample Membership (FR004/FR008)
        var membership = new Membership
        {
            Id = Guid.NewGuid(),
            UserId = challenger.Id,
            ChallengeId = challenge.Id,
            IsActive = true
        };

        db.Memberships.Add(membership);

        // 5. Persist to SQLite (FR002)
        db.SaveChanges();
    }
}
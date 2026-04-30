using MyProject.Server.Common;
using MyProject.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MyProject.Server.Infrastructure;

public static class DbInitializer {
    public static async Task SeedAsync(AppDbContext db) {
        // FR004: Apply migrations & seed initial data
        await db.Database.EnsureCreatedAsync(); 
        if (await db.Users.AnyAsync()) return;

        var user = new User { 
            Email = "dev@myproject.local", 
            DisplayName = "Junior Dev", 
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Challenge123!") 
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var challenge = new Challenge { 
            Title = "30 Days of Code", 
            Visibility = ChallengeVisibility.Public, 
            Status = ChallengeStatus.Open, 
            OwnerId = user.Id 
        };
        db.Challenges.Add(challenge);
        await db.SaveChangesAsync();

        db.Memberships.Add(new Membership { UserId = user.Id, ChallengeId = challenge.Id, Status = MembershipStatus.Active });
        await db.SaveChangesAsync();
    }
}
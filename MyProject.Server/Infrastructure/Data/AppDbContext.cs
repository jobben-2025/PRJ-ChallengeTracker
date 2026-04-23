using Microsoft.EntityFrameworkCore; // Required for EF Core
using MyProject.Server.Models;       // Required to see User, Challenge, etc.

namespace MyProject.Server.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options) {
    public DbSet<User> Users => Set<User>();
    public DbSet<Challenge> Challenges => Set<Challenge>();
    public DbSet<Membership> Memberships => Set<Membership>();
    public DbSet<ProgressEntry> ProgressEntries => Set<ProgressEntry>();

    protected override void OnModelCreating(ModelBuilder mb) {
        mb.Entity<User>().HasIndex(u => u.Email).IsUnique();
        // FR009: Enforce max 1 entry per user per challenge per day at DB level
        mb.Entity<ProgressEntry>().HasIndex(p => new { p.UserId, p.ChallengeId, p.LoggedAt }).IsUnique();
    }
}
using MyProject.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MyProject.Server.Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options) {
    public DbSet<User> Users => Set<User>();
    public DbSet<Challenge> Challenges => Set<Challenge>();
    public DbSet<Membership> Memberships => Set<Membership>();
    public DbSet<ProgressEntry> ProgressEntries => Set<ProgressEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        // FR003: Relationship indexing for performance/logic
        modelBuilder.Entity<Membership>().HasIndex(m => new { m.UserId, m.ChallengeId }).IsUnique();
    }
}
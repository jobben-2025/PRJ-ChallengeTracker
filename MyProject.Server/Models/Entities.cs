using MyProject.Server.Common;
using System.ComponentModel.DataAnnotations;

namespace MyProject.Server.Models;

public class User {
    public int Id { get; set; }
    [Required] public string Email { get; set; } = null!;
    [Required] public string PasswordHash { get; set; } = null!;
    [Required] public string DisplayName { get; set; } = null!;
    public List<Membership> Memberships { get; set; } = [];
}

public class Challenge {
    public int Id { get; set; }
    [Required] public string Title { get; set; } = null!;
    public int OwnerId { get; set; }
    public ChallengeStatus Status { get; set; } = ChallengeStatus.Open;
    public ChallengeVisibility Visibility { get; set; } = ChallengeVisibility.Public;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<Membership> Memberships { get; set; } = [];
    public List<ProgressEntry> ProgressEntries { get; set; } = [];
}

public class Membership {
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int ChallengeId { get; set; }
    public Challenge Challenge { get; set; } = null!;
    public MembershipStatus Status { get; set; }
}

public class ProgressEntry {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ChallengeId { get; set; }
    public decimal Amount { get; set; }
    public string? Note { get; set; }
    public DateTime LoggedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
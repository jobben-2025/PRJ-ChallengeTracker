// Models/Entities.cs
namespace MyProject.Server.Models;

public enum ChallengeStatus { Open, Running, Completed }
public enum ChallengeVisibility { Public, Private }

public class User {
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
}

public class Challenge {
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public Guid OwnerId { get; set; }
    public ChallengeStatus Status { get; set; } = ChallengeStatus.Open;
    public ChallengeVisibility Visibility { get; set; } = ChallengeVisibility.Public;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class Membership {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ChallengeId { get; set; }
    public bool IsActive { get; set; }
}

public class ProgressEntry {
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ChallengeId { get; set; }
    public double Amount { get; set; }
    public string? Note { get; set; }
    public DateTime LoggedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}


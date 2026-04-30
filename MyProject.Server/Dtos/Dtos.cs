using MyProject.Server.Common;
using System.ComponentModel.DataAnnotations;

namespace MyProject.Server.Dtos;

// FR012: Define request/response DTOs
public record RegisterRequest([Required][EmailAddress] string Email, [Required][MinLength(6)] string Password, [Required] string DisplayName);
public record LoginRequest(string Email, string Password);
public record CreateChallengeRequest([Required] string Title, ChallengeVisibility Visibility, DateTime? StartDate, DateTime? EndDate);
public record ProgressRequest([Range(0.01, 1000000)] decimal Amount, string? Note, DateTime? LoggedAt);
public record MembershipRequest(int ChallengeId);
public record LeaderboardEntry(string DisplayName, decimal TotalProgress);
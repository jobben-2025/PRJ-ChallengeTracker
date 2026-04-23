using System.ComponentModel.DataAnnotations; // Required for [Required], [EmailAddress], etc.
using MyProject.Server.Models;              // Required for ChallengeVisibility enum

// Dtos/Requests.cs (FR012)

namespace MyProject.Server.Dtos;

public record RegisterRequest([Required][EmailAddress] string Email, [Required][MinLength(6)] string Password, [Required] string DisplayName);
public record LoginRequest(string Email, string Password);
public record ChallengeRequest([Required] string Title, ChallengeVisibility Visibility);
public record ProgressRequest([Required][Range(0.01, double.MaxValue)] double Amount, string? Note, DateTime? LoggedAt);
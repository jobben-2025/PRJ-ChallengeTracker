using MyProject.Server.Infrastructure;
using MyProject.Server.Models;
using MyProject.Server.Dtos;
using MyProject.Server.Common;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MyProject.Server.Api.Endpoints;

public static class MembershipEndpoints
{
    public static void MapMembershipEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/memberships").RequireAuthorization();

        // FR008: Join a challenge
        group.MapPost("/", async (MembershipRequest req, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var challenge = await db.Challenges.FindAsync(req.ChallengeId);
            
            if (challenge == null) return Results.NotFound();

            var membership = new Membership
            {
                UserId = userId,
                ChallengeId = req.ChallengeId,
                // Auto-active if public, otherwise pending
                Status = challenge.Visibility == ChallengeVisibility.Public 
                         ? MembershipStatus.Active 
                         : MembershipStatus.Pending
            };

            db.Memberships.Add(membership);
            await db.SaveChangesAsync();
            // return Results.Created($"/memberships/{membership.Id}", membership);
            return Results.Created($"/memberships/{membership.Id}", new { membership.Id, membership.Status });
        });

        // FR008: Leave a challenge
        // group.MapDelete("/{id}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
        // {
        //     var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
        //     var membership = await db.Memberships.FindAsync(id);

        //     if (membership == null || membership.UserId != userId) return Results.Forbid();

        //     db.Memberships.Remove(membership);
        //     await db.SaveChangesAsync();
        //     return Results.NoContent();
        // });
        group.MapDelete("/{id}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userIdString = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null) return Results.Unauthorized();
    
            var userId = int.Parse(userIdString);
            var membership = await db.Memberships.FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

            if (membership == null) return Results.NotFound();

            db.Memberships.Remove(membership);
            await db.SaveChangesAsync();
            return Results.NoContent(); // 204 is the standard for DELETE
        });

        // FR008: Owner approves pending membership (Private Challenges)
        group.MapPatch("/{id}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var membership = await db.Memberships
                .Include(m => m.Challenge)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (membership == null || membership.Challenge.OwnerId != userId) return Results.Forbid();

            membership.Status = MembershipStatus.Active;
            await db.SaveChangesAsync();
            // return Results.Ok(membership);
            return Results.Ok(new { membership.Id, membership.Status });

        });
    }
}
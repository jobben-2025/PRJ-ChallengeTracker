// // other services...
// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(
//                       policy =>
//                       {
//                           policy.WithOrigins("http://localhost:5173")
//                           .AllowAnyHeader()
//                           .AllowAnyMethod();
//                       });
// });


// var app = builder.Build();

// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
//     app.MapScalarApiReference();
// }

// app.UseCors(); // before other middleware
// app.UseAuthentication();
// app.UseAuthorization();

// app.MapAuthEndpoints();
// app.MapUserEndpoints();
// app.MapPostEndpoints();

// app.Run();



using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Diagnostics.HealthChecks; // FR015: Required for HealthCheckOptions
using System.Security.Claims;
using MyProject.Server.Infrastructure.Data;
using MyProject.Server.Application.Services;
using MyProject.Server.Dtos;
using MyProject.Server.Api.Endpoints; // FR014: For the Map extension methods
using Scalar.AspNetCore; // FR001: Required for MapScalarApiReference


// FR001: Bootstrap Minimal API
var builder = WebApplication.CreateBuilder(args);

// FR002: EF Core SQLite registration
builder.Services.AddDbContext<AppDbContext>(opt => 
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=challenge.db"));

// FR016: Rate Limiting (Writes)
builder.Services.AddRateLimiter(options => {
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("write-policy", opt => {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
    });
    options.AddFixedWindowLimiter("progress-policy", opt => {
        opt.PermitLimit = 10;
        opt.Window = TimeSpan.FromMinutes(1);
    });
});

// FR015: Observability
// builder.Services.AddHealthChecks().AddSqlite("challenge.db");
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "Data Source=challenge.db";
builder.Services.AddHealthChecks().AddSqlite(connectionString);

builder.Services.AddOpenApi(); // Scalar/OpenAPI

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(/* JWT Setup */);
builder.Services.AddAuthorization();
builder.Services.AddScoped<ChallengeService>();
builder.Services.AddCors();

var app = builder.Build();

// FR013: Global Exception Handler (ProblemDetails)
app.UseExceptionHandler(err => err.Run(async ctx => {
    ctx.Response.StatusCode = 500;
    await ctx.Response.WriteAsJsonAsync(new ProblemDetails { 
        Status = 500, Title = "Internal Server Error", Detail = "Contact support." 
    });
}));

// 2. Security & Traffic Control (Must be before Endpoints)
// app.UseCors("DefaultPolicy");
app.UseCors(policy => policy
    .WithOrigins("http://localhost:5173") // Your frontend URL
    .AllowAnyHeader()
    .AllowAnyMethod());
app.UseRateLimiter();      // FR016: Crucial for your policies to actually apply
app.UseAuthentication();   // FR005: Required to identify the user
app.UseAuthorization();    // FR005: Required to check permissions

// FR015: Health Endpoints
app.MapHealthChecks("/health").AllowAnonymous();
// app.MapHealthChecks("/ready").AllowAnonymous();
app.MapHealthChecks("/ready", new HealthCheckOptions 
{
    Predicate = _ => true // Readiness (DB is connected)
}).AllowAnonymous();

app.MapAuthEndpoints();
app.MapLeaderboardEndpoints();

// Challenges (FR006)
var challengeGroup = app.MapGroup("/challenges")
    .RequireAuthorization()
    .RequireRateLimiting("write-policy"); 

// Progress (FR009 - note the specific policy)
var progressGroup = app.MapGroup("/progress-entries")
    .RequireAuthorization()
    .RequireRateLimiting("progress-policy");

// FR004: Migrations & Seeding (Dev only)
if (app.Environment.IsDevelopment()) 
{
    app.MapOpenApi();
    // using Scalar:
    app.MapScalarApiReference(); 

    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Create/Update the challenge.db file
    db.Database.Migrate(); 
    
    // Fill it with initial data
    SeedData.Initialize(db);
}

app.Run();

// Summary:
// FR009/FR010: Progress logic checks the 24h window for edits and the "one entry per day" constraint.
// FR012/FR013: All errors return ProblemDetails. Validation is handled via Data Annotations/Filters.
// FR014: Folders strictly separate Api (Endpoints), Application (Business logic), and Infrastructure (Data/Auth).
// FR016: Rate limits differentiate between standard writes (5/min) and progress logs (10/min).






// Project Requirements
// ID		Functional Requirement		Description
// FR001	Project Bootstrap (API)		Initialize ASP.NET Core Minimal API (dotnet new webapi). Enable Scalar/OpenAPI.
// FR002	EF Core + SQLite			Add EF Core with SQLite provider. Create AppDbContext and register in DI. Connection string Data Source=challenge.db.
// FR003	Domain Models				Implement User, Challenge, Membership, ProgressEntry with required fields and relationships (User↔Membership↔Challenge; Challenge↔ProgressEntry).
// FR004	Migrations & Seeding		Create initial migration; apply via CLI. On startup (Dev), seed: 1–2 users, 1 public challenge (status open), and a sample membership.
// FR005	Auth: Register & Login		Endpoints: POST /auth/register, POST /auth/login returning JWT. Store DisplayName and Email. GET /auth/me returning current user.
// FR006	Challenges: Create & Read	Endpoints: POST /challenges, `GET /challenges?visibility=public&status=(open
// FR007	Challenge State Transitions	Owner-only actions: POST /challenges/{id}:start (open→running), POST /challenges/{id}:complete (running→completed). Validate date window.
// FR008	Memberships: Join/Leave		POST /memberships { challengeId } to join (auto-active if public), DELETE /memberships/{id} to leave. Owner can approve pending (private) via PATCH /memberships/{id}.
// FR009	Progress Logging			POST /progress-entries { challengeId, amount, note?, loggedAt? }. Rules: amount > 0, loggedAt within challenge window, max 1 entry per user per challenge per day.
// FR010	Progress Management			PATCH /progress-entries/{id} and DELETE /progress-entries/{id} for the owner of the entry; edits allowed within 24h of creation.
// FR011	Leaderboard (Computed)		GET /leaderboards/challenges/{id}?period=total returns top participants by total progress. Server computes from ProgressEntry (no writes).
// FR012	DTOs & Validation			Define request/response DTOs under Dtos/*. Use attributes or a validation filter. Return RFC 7807 ProblemDetails (400) on validation errors.
// FR013	Error Handling				Global exception handler (UseExceptionHandler) returning ProblemDetails; no stack traces in responses.
// OK FR014	Project Structure (API)		Follow layered directories: Api/ (Endpoints/Filters/Middleware), Application/ (Interfaces/Services), Infrastructure/ (Data, Migrations), Models/, Dtos/, Common/. Keep Api thin.
// FR015	Observability Basics		Add /health (liveness) and /ready (DB connectivity/migrations).
// FR016	Rate Limiting (Writes)		Configure limiter: Progress POST = 10/min per user; other POSTs = 5/min. Exempt health/readiness.
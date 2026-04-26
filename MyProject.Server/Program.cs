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


using MyProject.Server.Api.Endpoints;
using MyProject.Server.Api.Middleware;
using MyProject.Server.Application;
using MyProject.Server.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.RateLimiting; // Added for AddFixedWindowLimiter
using System.Text;
using System.Threading.RateLimiting;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// FR002: EF Core + SQLite
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlite("Data Source=challenge.db"));

// FR005: Auth & JWT
builder.Services.AddScoped<AuthService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt => {
    opt.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuer = true, 
        ValidateAudience = true, 
        ValidateLifetime = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});
builder.Services.AddAuthorization();

// FR016: Rate Limiting
builder.Services.AddRateLimiter(opt => {
    opt.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    
    // POSTs = 5/min
    opt.AddFixedWindowLimiter("write", o => { 
        o.PermitLimit = 5; 
        o.Window = TimeSpan.FromMinutes(1); 
        o.QueueLimit = 0;
    });
    
    // Progress POST = 10/min
    opt.AddFixedWindowLimiter("progress", o => { 
        o.PermitLimit = 10; 
        o.Window = TimeSpan.FromMinutes(1); 
        o.QueueLimit = 0;
    });
});

// FR015: Health Checks (Requires EF Core HealthCheck Package)
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// FR013: Global Exception Handler
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
    app.MapScalarApiReference();
    
    // FR004: Migrations & Seeding
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbInitializer.SeedAsync(db);
}

app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter(); // FR016: Ensure Rate Limiting middleware is active

// FR015: Observability Endpoints (Exempt from Rate Limiting by not applying policy)
app.MapHealthChecks("/health");
app.MapHealthChecks("/ready");

// Map Layered Endpoints
app.MapAuthEndpoints();
app.MapChallengeEndpoints();
app.MapProgressEndpoints();
app.MapMembershipEndpoints();

app.Run();







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
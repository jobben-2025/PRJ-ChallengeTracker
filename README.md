### DEV NOTES - BACKEND (MyProject.Server):

https://github.com/jobben-2025/PRJ-ChallengeTracker

#project was setup:
Required NuGet Packages (FR Checklist)
Requirement	Package Name	CLI Command
FR002	Entity Framework Core (SQLite)	dotnet add package Microsoft.EntityFrameworkCore.Sqlite
FR004	EF Core Design (for Migrations)	dotnet add package Microsoft.EntityFrameworkCore.Design
FR005	JWT Authentication	dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
FR005	Password Hashing	dotnet add package BCrypt.Net-Next
FR015	Health Checks (SQLite)	dotnet add package AspNetCore.HealthChecks.Sqlite
FR001	Scalar (OpenAPI UI)	dotnet add package Scalar.AspNetCore


#after git clone do a 'dotnet restore' to ensure all packages are up

#switch to dev
git checkout dev
git pull origin

git checkout feature/name   #create branches for your individual code/feature to provide


## 5-step check and EXPOSED AT:
dotnet build
dotnet run

<!-- -> Should say Healthy. -->
http://localhost:5039/health

<!-- -> Should say Healthy. -->
http://localhost:5039/ready

<!-- -> API+documentation live -->
http://localhost:5039/scalar/v1



## FINAL VERIFICATION OF PROJECT REQUIREMENTS:
FR001-FR004: API starts, uses SQLite, and persists data correctly.
FR005: JWT Auth and /auth/me are functional.
FR006-FR007: Challenges are created and transition states (Start) successfully.
FR008: Membership Join, Owner Approval (Patch), and Leave (Delete) are fully functional.
FR009-FR010: Progress is logged within the window and editable within the 24h limit.
FR011: Leaderboard is computed on-the-fly and returns data without crashing.
FR012-FR014: Layered structure is maintained, DTOs prevent circular JSON errors, and logic is correctly separated.
FR015-FR016: Health checks and Rate Limiting are configured in the pipeline.

Clean Slate Test (Optional)
** getting rid of errors in first 2 lines => delete challenge.db **
Stop the API.
Delete the challenge.db file in your project folder.

Restart the API (dotnet run).
Run the Python test-script again.



WHILE dotnet run - backend available on http://localhost:5039/scalar/v1
RUN python _MyProject.Server_API_test.py to check if HTTP requests are answered properly:
2026-04-26 16:13:10,762 - --- Starting API Integration Test ---
2026-04-26 16:13:10,933 - User 1 Registration            | OK (200)
2026-04-26 16:13:11,072 - User 2 Registration            | OK (200)
2026-04-26 16:13:11,199 - User 1 Login                   | OK (200)
2026-04-26 16:13:11,302 - User 2 Login                   | OK (200)
2026-04-26 16:13:11,322 - Create Private Challenge       | OK (201)
2026-04-26 16:13:11,334 - Start Challenge                | OK (200)
2026-04-26 16:13:11,339 - Join Challenge (User 2)        | OK (201)
2026-04-26 16:13:11,357 - Approve Membership (Owner)     | OK (200)
2026-04-26 16:13:11,375 - Log Progress                   | OK (201)
2026-04-26 16:13:11,380 - Update Progress (within 24h)   | OK (204)
2026-04-26 16:13:11,391 - View Leaderboard               | OK (200)
2026-04-26 16:13:11,393 - Auth Me Check                  | OK (200)
2026-04-26 16:13:11,400 - Leave Challenge                | OK (204)
2026-04-26 16:13:11,400 - --- Test Suite Complete ---

IF NOT RUNNING do 'source ./venv/activate' first



using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyProject.Server.Application;

public class AuthService(IConfiguration config) {
    public string GenerateToken(int userId, string email) {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email)
        };

        var token = new JwtSecurityToken(
            config["Jwt:Issuer"], 
            config["Jwt:Audience"], 
            claims, 
            expires: DateTime.Now.AddDays(1), 
            signingCredentials: creds);
            
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
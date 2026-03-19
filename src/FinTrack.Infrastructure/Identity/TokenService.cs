using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FinTrack.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FinTrack.Infrastructure.Identity;

public class TokenService : ITokenService
{
    private readonly string _secret;
    private readonly string _issuer;
    private readonly string _audience;
    private const int AccessTokenMinutes = 15;

    public TokenService(IConfiguration configuration)
    {
        // Segredos lidos de variáveis de ambiente, nunca do appsettings.json
        _secret = configuration["JwtSettings:Secret"]
            ?? throw new InvalidOperationException("JwtSettings:Secret não configurado.");
        _issuer = configuration["JwtSettings:Issuer"]
            ?? throw new InvalidOperationException("JwtSettings:Issuer não configurado.");
        _audience = configuration["JwtSettings:Audience"]
            ?? throw new InvalidOperationException("JwtSettings:Audience não configurado.");
    }

    public string GenerateAccessToken(string userId, string email, string name)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(JwtRegisteredClaimNames.Name, name),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, userId)
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(AccessTokenMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var bytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }

    public string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(bytes);
    }

    public DateTime GetAccessTokenExpiration()
        => DateTime.UtcNow.AddMinutes(AccessTokenMinutes);
}

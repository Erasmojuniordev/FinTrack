using FinTrack.Application.Interfaces;
using FinTrack.Infrastructure.Identity;
using FinTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Infrastructure.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AppDbContext _context;

    public RefreshTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(bool IsValid, string? UserId)> ValidateAsync(string tokenHash, CancellationToken cancellationToken = default)
    {
        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(r => r.Token == tokenHash && !r.IsRevoked && r.ExpiresAt > DateTime.UtcNow, cancellationToken);

        return token is not null ? (true, token.UserId) : (false, null);
    }

    public async Task SaveAsync(string userId, string tokenHash, DateTime expiresAt, CancellationToken cancellationToken = default)
    {
        var refreshToken = new RefreshToken
        {
            UserId = userId,
            Token = tokenHash,
            ExpiresAt = expiresAt,
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RevokeAsync(string tokenHash, CancellationToken cancellationToken = default)
    {
        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(r => r.Token == tokenHash, cancellationToken);

        if (token is not null)
        {
            token.IsRevoked = true;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task RevokeAllByUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        var tokens = await _context.RefreshTokens
            .Where(r => r.UserId == userId && !r.IsRevoked)
            .ToListAsync(cancellationToken);

        foreach (var token in tokens)
            token.IsRevoked = true;

        await _context.SaveChangesAsync(cancellationToken);
    }
}

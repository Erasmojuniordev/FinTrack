namespace FinTrack.Application.Interfaces;

public interface IRefreshTokenRepository
{
    Task<(bool IsValid, string? UserId)> ValidateAsync(string tokenHash, CancellationToken cancellationToken = default);
    Task SaveAsync(string userId, string tokenHash, DateTime expiresAt, CancellationToken cancellationToken = default);
    Task RevokeAsync(string tokenHash, CancellationToken cancellationToken = default);
    Task RevokeAllByUserAsync(string userId, CancellationToken cancellationToken = default);
}

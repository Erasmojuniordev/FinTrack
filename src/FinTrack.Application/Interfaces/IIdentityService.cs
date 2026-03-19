using FinTrack.Application.Features.Auth.DTOs;

namespace FinTrack.Application.Interfaces;

/// <summary>
/// Abstração dos serviços de identidade (ASP.NET Core Identity).
/// Mantém a camada Application independente de referências ao Identity.
/// </summary>
public interface IIdentityService
{
    Task<(bool Success, string? Error)> RegisterAsync(string name, string email, string password);
    Task<(bool Success, string? UserId, string? UserName, string? Error)> ValidateCredentialsAsync(string email, string password);
    Task<bool> UserExistsAsync(string email);
    Task<(string? UserId, string? UserName, string? UserEmail)> GetUserByIdAsync(string userId);
}

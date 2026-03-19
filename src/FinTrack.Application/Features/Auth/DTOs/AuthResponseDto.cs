namespace FinTrack.Application.Features.Auth.DTOs;

/// <summary>
/// DTO retornado pelos handlers de autenticação.
/// O RefreshToken bruto é enviado ao controller para ser definido como httpOnly cookie.
/// O cliente nunca recebe o RefreshToken diretamente no body JSON.
/// </summary>
public record AuthResponseDto(
    string AccessToken,
    DateTime ExpiresAt,
    string UserName,
    string UserEmail,
    string RefreshToken
);

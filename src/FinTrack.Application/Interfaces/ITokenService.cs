namespace FinTrack.Application.Interfaces;

/// <summary>
/// Interface para geração e validação de tokens JWT e Refresh Tokens.
/// Implementada na camada Infrastructure para evitar dependência de libs de JWT no Application.
/// </summary>
public interface ITokenService
{
    /// <summary>Gera um JWT de acesso com expiração de 15 minutos.</summary>
    string GenerateAccessToken(string userId, string email, string name);

    /// <summary>Gera um refresh token aleatório criptograficamente seguro (em texto plano, para enviar ao cliente).</summary>
    string GenerateRefreshToken();

    /// <summary>Retorna o hash SHA256 de um token (usado para armazenar o refresh token no banco).</summary>
    string HashToken(string token);

    /// <summary>Retorna a data de expiração do access token.</summary>
    DateTime GetAccessTokenExpiration();
}

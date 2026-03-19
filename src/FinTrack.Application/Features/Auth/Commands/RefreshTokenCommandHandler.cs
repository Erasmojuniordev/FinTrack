using FinTrack.Application.Common;
using FinTrack.Application.Features.Auth.DTOs;
using FinTrack.Application.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Auth.Commands;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<AuthResponseDto>>
{
    private readonly IIdentityService _identityService;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public RefreshTokenCommandHandler(
        IIdentityService identityService,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _identityService = identityService;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<Result<AuthResponseDto>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenHash = _tokenService.HashToken(request.RefreshToken);
        var (isValid, userId) = await _refreshTokenRepository.ValidateAsync(tokenHash, cancellationToken);

        if (!isValid || userId is null)
            return Result<AuthResponseDto>.Unauthorized("Refresh token inválido ou expirado.");

        // Revoga o token antigo (rotação de refresh token para segurança)
        await _refreshTokenRepository.RevokeAsync(tokenHash, cancellationToken);

        var (_, userName, userEmail) = await _identityService.GetUserByIdAsync(userId);
        if (userEmail is null)
            return Result<AuthResponseDto>.Unauthorized("Usuário não encontrado.");

        var accessToken = _tokenService.GenerateAccessToken(userId, userEmail, userName ?? string.Empty);
        var expiresAt = _tokenService.GetAccessTokenExpiration();

        var newRawRefreshToken = _tokenService.GenerateRefreshToken();
        var newHashedToken = _tokenService.HashToken(newRawRefreshToken);
        await _refreshTokenRepository.SaveAsync(userId, newHashedToken, DateTime.UtcNow.AddDays(7), cancellationToken);

        return Result<AuthResponseDto>.Success(
            new AuthResponseDto(accessToken, expiresAt, userName ?? string.Empty, userEmail, newRawRefreshToken));
    }
}

using FinTrack.Application.Common;
using FinTrack.Application.Features.Auth.DTOs;
using FinTrack.Application.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Auth.Commands;

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthResponseDto>>
{
    private readonly IIdentityService _identityService;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public LoginCommandHandler(
        IIdentityService identityService,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _identityService = identityService;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<Result<AuthResponseDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var (success, userId, userName, error) = await _identityService.ValidateCredentialsAsync(request.Email, request.Password);

        if (!success || userId is null)
            return Result<AuthResponseDto>.Unauthorized("E-mail ou senha inválidos.");

        var accessToken = _tokenService.GenerateAccessToken(userId, request.Email, userName ?? string.Empty);
        var expiresAt = _tokenService.GetAccessTokenExpiration();

        var rawRefreshToken = _tokenService.GenerateRefreshToken();
        var hashedToken = _tokenService.HashToken(rawRefreshToken);
        await _refreshTokenRepository.SaveAsync(userId, hashedToken, DateTime.UtcNow.AddDays(7), cancellationToken);

        return Result<AuthResponseDto>.Success(
            new AuthResponseDto(accessToken, expiresAt, userName ?? string.Empty, request.Email, rawRefreshToken));
    }
}

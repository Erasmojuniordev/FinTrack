using FinTrack.Application.Common;
using FinTrack.Application.Features.Auth.DTOs;
using FinTrack.Application.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Auth.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<AuthResponseDto>>
{
    private readonly IIdentityService _identityService;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public RegisterCommandHandler(
        IIdentityService identityService,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository)
    {
        _identityService = identityService;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<Result<AuthResponseDto>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        if (await _identityService.UserExistsAsync(request.Email))
            return Result<AuthResponseDto>.Conflict("Já existe um usuário cadastrado com este e-mail.");

        var (success, error) = await _identityService.RegisterAsync(request.Name, request.Email, request.Password);
        if (!success)
            return Result<AuthResponseDto>.Failure(error ?? "Falha ao registrar usuário.");

        var (userId, userName, userEmail) = await _identityService.GetUserByIdAsync(request.Email);
        if (userId is null)
            return Result<AuthResponseDto>.Failure("Falha ao recuperar usuário após registro.");

        var accessToken = _tokenService.GenerateAccessToken(userId, request.Email, request.Name);
        var expiresAt = _tokenService.GetAccessTokenExpiration();

        var rawRefreshToken = _tokenService.GenerateRefreshToken();
        var hashedToken = _tokenService.HashToken(rawRefreshToken);
        await _refreshTokenRepository.SaveAsync(userId, hashedToken, DateTime.UtcNow.AddDays(7), cancellationToken);

        return Result<AuthResponseDto>.Created(
            new AuthResponseDto(accessToken, expiresAt, userName ?? request.Name, userEmail ?? request.Email, rawRefreshToken));
    }
}

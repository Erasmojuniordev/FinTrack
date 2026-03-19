using FinTrack.Application.Common;
using FinTrack.Application.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Auth.Commands;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, Result<bool>>
{
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public LogoutCommandHandler(ITokenService tokenService, IRefreshTokenRepository refreshTokenRepository)
    {
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<Result<bool>> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var tokenHash = _tokenService.HashToken(request.RefreshToken);
        await _refreshTokenRepository.RevokeAsync(tokenHash, cancellationToken);
        return Result<bool>.NoContent();
    }
}

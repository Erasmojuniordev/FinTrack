using FinTrack.Application.Features.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace FinTrack.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private const string RefreshTokenCookieName = "refreshToken";

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>Registra um novo usuário e retorna tokens de acesso.</summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.IsSuccess)
            return StatusCode(result.StatusCode, new { error = result.Error });

        SetRefreshTokenCookie(result.Value!.RefreshToken);

        return StatusCode(StatusCodes.Status201Created, new
        {
            accessToken = result.Value.AccessToken,
            expiresAt = result.Value.ExpiresAt,
            user = new { name = result.Value.UserName, email = result.Value.UserEmail }
        });
    }

    /// <summary>Autentica o usuário. Retorna access token no body e refresh token como httpOnly cookie.</summary>
    [HttpPost("login")]
    [EnableRateLimiting("login")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.IsSuccess)
            return StatusCode(result.StatusCode, new { error = result.Error });

        SetRefreshTokenCookie(result.Value!.RefreshToken);

        return Ok(new
        {
            accessToken = result.Value.AccessToken,
            expiresAt = result.Value.ExpiresAt,
            user = new { name = result.Value.UserName, email = result.Value.UserEmail }
        });
    }

    /// <summary>Renova o access token usando o refresh token do cookie httpOnly.</summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh(CancellationToken cancellationToken)
    {
        var refreshToken = Request.Cookies[RefreshTokenCookieName];

        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new { error = "Refresh token não encontrado." });

        var result = await _mediator.Send(new RefreshTokenCommand(refreshToken), cancellationToken);

        if (!result.IsSuccess)
        {
            Response.Cookies.Delete(RefreshTokenCookieName);
            return StatusCode(result.StatusCode, new { error = result.Error });
        }

        SetRefreshTokenCookie(result.Value!.RefreshToken);

        return Ok(new
        {
            accessToken = result.Value.AccessToken,
            expiresAt = result.Value.ExpiresAt,
            user = new { name = result.Value.UserName, email = result.Value.UserEmail }
        });
    }

    /// <summary>Invalida o refresh token e encerra a sessão.</summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var refreshToken = Request.Cookies[RefreshTokenCookieName] ?? string.Empty;

        await _mediator.Send(new LogoutCommand(refreshToken), cancellationToken);
        Response.Cookies.Delete(RefreshTokenCookieName);

        return NoContent();
    }

    private void SetRefreshTokenCookie(string token)
    {
        Response.Cookies.Append(RefreshTokenCookieName, token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });
    }
}

using FinTrack.Application.Common;
using FinTrack.Application.Features.Auth.DTOs;
using MediatR;

namespace FinTrack.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<Result<AuthResponseDto>>;

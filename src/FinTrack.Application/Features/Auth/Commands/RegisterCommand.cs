using FinTrack.Application.Common;
using FinTrack.Application.Features.Auth.DTOs;
using MediatR;

namespace FinTrack.Application.Features.Auth.Commands;

public record RegisterCommand(string Name, string Email, string Password) : IRequest<Result<AuthResponseDto>>;

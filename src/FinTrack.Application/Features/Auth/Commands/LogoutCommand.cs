using FinTrack.Application.Common;
using MediatR;

namespace FinTrack.Application.Features.Auth.Commands;

public record LogoutCommand(string RefreshToken) : IRequest<Result<bool>>;

using FinTrack.Application.Common;
using MediatR;

namespace FinTrack.Application.Features.Categories.Commands;

public record DeleteCategoryCommand(Guid Id, Guid UserId) : IRequest<Result<bool>>;

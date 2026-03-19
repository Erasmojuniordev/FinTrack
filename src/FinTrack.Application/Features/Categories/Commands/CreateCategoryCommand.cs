using FinTrack.Application.Common;
using FinTrack.Application.Features.Categories.DTOs;
using MediatR;

namespace FinTrack.Application.Features.Categories.Commands;

public record CreateCategoryCommand(
    Guid UserId,
    string Name,
    string Color,
    string Icon
) : IRequest<Result<CategoryDto>>;

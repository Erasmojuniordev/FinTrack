using FinTrack.Application.Common;
using FinTrack.Application.Features.Categories.DTOs;
using MediatR;

namespace FinTrack.Application.Features.Categories.Queries;

public record GetCategoriesQuery(Guid UserId) : IRequest<Result<IEnumerable<CategoryDto>>>;

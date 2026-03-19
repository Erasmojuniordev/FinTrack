using FinTrack.Application.Common;
using FinTrack.Application.Features.Categories.DTOs;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Categories.Queries;

public class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, Result<IEnumerable<CategoryDto>>>
{
    private readonly ICategoryRepository _categoryRepository;

    public GetCategoriesQueryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<IEnumerable<CategoryDto>>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAvailableForUserAsync(request.UserId, cancellationToken);

        var dtos = categories.Select(c => new CategoryDto(
            c.Id,
            c.Name,
            c.Color,
            c.Icon,
            c.IsDefault,
            IsSystem: c.UserId == null
        ));

        return Result<IEnumerable<CategoryDto>>.Success(dtos);
    }
}

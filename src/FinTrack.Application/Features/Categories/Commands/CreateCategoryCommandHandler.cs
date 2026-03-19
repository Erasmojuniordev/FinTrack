using FinTrack.Application.Common;
using FinTrack.Application.Features.Categories.DTOs;
using FinTrack.Domain.Entities;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Categories.Commands;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Result<CategoryDto>>
{
    private readonly ICategoryRepository _categoryRepository;

    public CreateCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<CategoryDto>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new Category
        {
            UserId = request.UserId,
            Name = request.Name,
            Color = request.Color,
            Icon = request.Icon,
            IsDefault = false,
            IsDeleted = false,
            CreatedBy = request.UserId.ToString(),
        };

        await _categoryRepository.AddAsync(category, cancellationToken);

        return Result<CategoryDto>.Created(new CategoryDto(
            category.Id,
            category.Name,
            category.Color,
            category.Icon,
            category.IsDefault,
            IsSystem: false
        ));
    }
}

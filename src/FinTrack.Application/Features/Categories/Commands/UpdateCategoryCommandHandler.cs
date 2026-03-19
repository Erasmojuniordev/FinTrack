using FinTrack.Application.Common;
using FinTrack.Application.Features.Categories.DTOs;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Categories.Commands;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Result<CategoryDto>>
{
    private readonly ICategoryRepository _categoryRepository;

    public UpdateCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<CategoryDto>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);

        if (category is null)
            return Result<CategoryDto>.NotFound("Categoria não encontrada.");

        // Impede edição de categorias do sistema (UserId == null) ou de outros usuários
        if (category.UserId == null || category.UserId != request.UserId)
            return Result<CategoryDto>.Failure("Não é possível editar esta categoria.", 403);

        category.Name = request.Name;
        category.Color = request.Color;
        category.Icon = request.Icon;

        await _categoryRepository.UpdateAsync(category, cancellationToken);

        return Result<CategoryDto>.Success(new CategoryDto(
            category.Id,
            category.Name,
            category.Color,
            category.Icon,
            category.IsDefault,
            IsSystem: false
        ));
    }
}

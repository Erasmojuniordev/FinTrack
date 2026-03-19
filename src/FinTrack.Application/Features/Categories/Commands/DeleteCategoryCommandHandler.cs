using FinTrack.Application.Common;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Categories.Commands;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result<bool>>
{
    private readonly ICategoryRepository _categoryRepository;

    public DeleteCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<bool>> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);

        if (category is null)
            return Result<bool>.NotFound("Categoria não encontrada.");

        // Impede exclusão de categorias do sistema ou de outros usuários
        if (category.UserId == null || category.UserId != request.UserId)
            return Result<bool>.Failure("Não é possível excluir esta categoria.", 403);

        // Impede exclusão se existem transações vinculadas
        var hasTransactions = await _categoryRepository.HasTransactionsAsync(request.Id, cancellationToken);
        if (hasTransactions)
            return Result<bool>.Conflict("Categoria possui transações vinculadas e não pode ser excluída.");

        await _categoryRepository.DeleteAsync(category, cancellationToken);

        return Result<bool>.NoContent();
    }
}

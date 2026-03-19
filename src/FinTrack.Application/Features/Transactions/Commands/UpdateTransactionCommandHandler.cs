using FinTrack.Application.Common;
using FinTrack.Application.Features.Transactions.DTOs;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Transactions.Commands;

public class UpdateTransactionCommandHandler : IRequestHandler<UpdateTransactionCommand, Result<TransactionDto>>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly ICategoryRepository _categoryRepository;

    public UpdateTransactionCommandHandler(
        ITransactionRepository transactionRepository,
        ICategoryRepository categoryRepository)
    {
        _transactionRepository = transactionRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<TransactionDto>> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _transactionRepository.GetByIdAsync(request.Id, request.UserId, cancellationToken);

        if (transaction is null)
            return Result<TransactionDto>.NotFound("Transação não encontrada.");

        if (request.CategoryId.HasValue)
        {
            var category = await _categoryRepository.GetByIdAsync(request.CategoryId.Value, cancellationToken);
            if (category is null)
                return Result<TransactionDto>.NotFound("Categoria não encontrada.");

            if (category.UserId != null && category.UserId != request.UserId)
                return Result<TransactionDto>.Failure("Categoria não disponível para este usuário.", 403);
        }

        transaction.Description = request.Description;
        transaction.AmountInCents = request.AmountInCents;
        transaction.Type = request.Type;
        transaction.Date = request.Date.ToUniversalTime();
        transaction.CategoryId = request.CategoryId;
        transaction.Notes = request.Notes;
        transaction.IsRecurring = request.IsRecurring;

        await _transactionRepository.UpdateAsync(transaction, cancellationToken);

        var updated = await _transactionRepository.GetByIdAsync(transaction.Id, request.UserId, cancellationToken);

        return Result<TransactionDto>.Success(new TransactionDto(
            updated!.Id,
            updated.Description,
            updated.AmountInCents,
            updated.Type,
            updated.Date,
            updated.Notes,
            updated.IsRecurring,
            updated.CategoryId,
            updated.Category?.Name,
            updated.Category?.Color,
            updated.Category?.Icon,
            updated.CreatedAt
        ));
    }
}

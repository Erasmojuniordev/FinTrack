using FinTrack.Application.Common;
using FinTrack.Application.Features.Transactions.DTOs;
using FinTrack.Domain.Entities;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Transactions.Commands;

public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, Result<TransactionDto>>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly ICategoryRepository _categoryRepository;

    public CreateTransactionCommandHandler(
        ITransactionRepository transactionRepository,
        ICategoryRepository categoryRepository)
    {
        _transactionRepository = transactionRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<TransactionDto>> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        // Valida se a categoria existe e pertence ao usuário (ou é do sistema)
        if (request.CategoryId.HasValue)
        {
            var category = await _categoryRepository.GetByIdAsync(request.CategoryId.Value, cancellationToken);
            if (category is null)
                return Result<TransactionDto>.NotFound("Categoria não encontrada.");

            if (category.UserId != null && category.UserId != request.UserId)
                return Result<TransactionDto>.Failure("Categoria não disponível para este usuário.", 403);
        }

        var transaction = new Transaction
        {
            UserId = request.UserId,
            Description = request.Description,
            AmountInCents = request.AmountInCents,
            Type = request.Type,
            Date = request.Date.ToUniversalTime(),
            CategoryId = request.CategoryId,
            Notes = request.Notes,
            IsRecurring = request.IsRecurring,
            IsDeleted = false,
            CreatedBy = request.UserId.ToString(),
        };

        await _transactionRepository.AddAsync(transaction, cancellationToken);

        // Recarrega com a categoria para retornar dados completos
        var created = await _transactionRepository.GetByIdAsync(transaction.Id, request.UserId, cancellationToken);

        return Result<TransactionDto>.Created(new TransactionDto(
            created!.Id,
            created.Description,
            created.AmountInCents,
            created.Type,
            created.Date,
            created.Notes,
            created.IsRecurring,
            created.CategoryId,
            created.Category?.Name,
            created.Category?.Color,
            created.Category?.Icon,
            created.CreatedAt
        ));
    }
}

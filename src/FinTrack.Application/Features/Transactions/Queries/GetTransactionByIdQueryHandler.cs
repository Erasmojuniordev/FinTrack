using FinTrack.Application.Common;
using FinTrack.Application.Features.Transactions.DTOs;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Transactions.Queries;

public class GetTransactionByIdQueryHandler : IRequestHandler<GetTransactionByIdQuery, Result<TransactionDto>>
{
    private readonly ITransactionRepository _transactionRepository;

    public GetTransactionByIdQueryHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<TransactionDto>> Handle(GetTransactionByIdQuery request, CancellationToken cancellationToken)
    {
        var transaction = await _transactionRepository.GetByIdAsync(request.Id, request.UserId, cancellationToken);

        if (transaction is null)
            return Result<TransactionDto>.NotFound("Transação não encontrada.");

        return Result<TransactionDto>.Success(new TransactionDto(
            transaction.Id,
            transaction.Description,
            transaction.AmountInCents,
            transaction.Type,
            transaction.Date,
            transaction.Notes,
            transaction.IsRecurring,
            transaction.CategoryId,
            transaction.Category?.Name,
            transaction.Category?.Color,
            transaction.Category?.Icon,
            transaction.CreatedAt
        ));
    }
}

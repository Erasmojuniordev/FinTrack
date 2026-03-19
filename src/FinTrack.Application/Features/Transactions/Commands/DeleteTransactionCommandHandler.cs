using FinTrack.Application.Common;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Transactions.Commands;

public class DeleteTransactionCommandHandler : IRequestHandler<DeleteTransactionCommand, Result<bool>>
{
    private readonly ITransactionRepository _transactionRepository;

    public DeleteTransactionCommandHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<bool>> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _transactionRepository.GetByIdAsync(request.Id, request.UserId, cancellationToken);

        if (transaction is null)
            return Result<bool>.NotFound("Transação não encontrada.");

        await _transactionRepository.DeleteAsync(transaction, cancellationToken);

        return Result<bool>.NoContent();
    }
}

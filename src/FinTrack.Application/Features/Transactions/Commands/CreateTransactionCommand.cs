using FinTrack.Application.Common;
using FinTrack.Application.Features.Transactions.DTOs;
using FinTrack.Domain.Enums;
using MediatR;

namespace FinTrack.Application.Features.Transactions.Commands;

public record CreateTransactionCommand(
    Guid UserId,
    string Description,
    long AmountInCents,
    TransactionType Type,
    DateTime Date,
    Guid? CategoryId,
    string? Notes,
    bool IsRecurring
) : IRequest<Result<TransactionDto>>;

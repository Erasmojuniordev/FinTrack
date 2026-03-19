using FinTrack.Application.Common;
using FinTrack.Application.Features.Transactions.DTOs;
using MediatR;

namespace FinTrack.Application.Features.Transactions.Queries;

public record GetTransactionByIdQuery(Guid Id, Guid UserId) : IRequest<Result<TransactionDto>>;

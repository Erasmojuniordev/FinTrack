using FinTrack.Application.Common;
using FinTrack.Application.Features.Transactions.DTOs;
using FinTrack.Domain.Enums;
using MediatR;

namespace FinTrack.Application.Features.Transactions.Queries;

public record GetTransactionsQuery(
    Guid UserId,
    DateTime? StartDate = null,
    DateTime? EndDate = null,
    Guid? CategoryId = null,
    TransactionType? Type = null,
    int Page = 1,
    int PageSize = 20
) : IRequest<Result<PagedTransactionsDto>>;

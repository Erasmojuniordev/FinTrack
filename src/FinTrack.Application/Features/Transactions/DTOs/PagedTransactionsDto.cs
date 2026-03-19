namespace FinTrack.Application.Features.Transactions.DTOs;

public record PagedTransactionsDto(
    IEnumerable<TransactionDto> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages,
    bool HasPreviousPage,
    bool HasNextPage,
    TransactionSummaryDto Summary
);

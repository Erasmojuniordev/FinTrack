using FinTrack.Application.Common;
using FinTrack.Application.Features.Transactions.DTOs;
using FinTrack.Domain.Enums;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Transactions.Queries;

public class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, Result<PagedTransactionsDto>>
{
    private readonly ITransactionRepository _transactionRepository;

    public GetTransactionsQueryHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<PagedTransactionsDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _transactionRepository.GetFilteredAsync(
            request.UserId,
            request.StartDate,
            request.EndDate,
            request.CategoryId,
            request.Type,
            request.Page,
            request.PageSize,
            cancellationToken
        );

        var transactionList = items.ToList();

        var dtos = transactionList.Select(MapToDto);

        // Resumo calculado sobre todos os itens da página atual
        var totalIncome = transactionList
            .Where(t => t.Type == TransactionType.Income)
            .Sum(t => t.AmountInCents);

        var totalExpense = transactionList
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.AmountInCents);

        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        var result = new PagedTransactionsDto(
            Items: dtos,
            Page: request.Page,
            PageSize: request.PageSize,
            TotalCount: totalCount,
            TotalPages: totalPages,
            HasPreviousPage: request.Page > 1,
            HasNextPage: request.Page < totalPages,
            Summary: new TransactionSummaryDto(totalIncome, totalExpense, totalIncome - totalExpense)
        );

        return Result<PagedTransactionsDto>.Success(result);
    }

    private static TransactionDto MapToDto(Domain.Entities.Transaction t) => new(
        t.Id,
        t.Description,
        t.AmountInCents,
        t.Type,
        t.Date,
        t.Notes,
        t.IsRecurring,
        t.CategoryId,
        t.Category?.Name,
        t.Category?.Color,
        t.Category?.Icon,
        t.CreatedAt
    );
}

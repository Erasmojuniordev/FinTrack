using FinTrack.Application.Common;
using FinTrack.Application.Features.Dashboard.DTOs;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Dashboard.Queries;

public class GetExpensesByCategoryQueryHandler : IRequestHandler<GetExpensesByCategoryQuery, Result<IEnumerable<ExpenseByCategoryDto>>>
{
    private readonly ITransactionRepository _transactionRepository;

    public GetExpensesByCategoryQueryHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<IEnumerable<ExpenseByCategoryDto>>> Handle(GetExpensesByCategoryQuery request, CancellationToken cancellationToken)
    {
        var items = (await _transactionRepository.GetExpensesByCategoryAsync(
            request.UserId, request.StartDate, request.EndDate, cancellationToken)).ToList();

        var totalGeral = items.Sum(x => x.TotalInCents);

        var dtos = items.Select(x => new ExpenseByCategoryDto(
            x.CategoryId,
            x.CategoryName,
            x.CategoryColor,
            x.TotalInCents,
            totalGeral > 0 ? Math.Round((decimal)x.TotalInCents / totalGeral * 100, 1) : 0m
        ));

        return Result<IEnumerable<ExpenseByCategoryDto>>.Success(dtos);
    }
}

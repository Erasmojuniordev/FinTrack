using FinTrack.Application.Common;
using FinTrack.Application.Features.Dashboard.DTOs;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Dashboard.Queries;

public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, Result<DashboardSummaryDto>>
{
    private readonly ITransactionRepository _transactionRepository;

    public GetDashboardSummaryQueryHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<DashboardSummaryDto>> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        var (totalIncome, totalExpense) = await _transactionRepository.GetSummaryAsync(
            request.UserId, request.StartDate, request.EndDate, cancellationToken);

        var balance = totalIncome - totalExpense;

        var savingsRate = totalIncome > 0
            ? Math.Round((decimal)balance / totalIncome * 100, 1)
            : 0m;

        return Result<DashboardSummaryDto>.Success(new DashboardSummaryDto(
            totalIncome,
            totalExpense,
            balance,
            savingsRate
        ));
    }
}

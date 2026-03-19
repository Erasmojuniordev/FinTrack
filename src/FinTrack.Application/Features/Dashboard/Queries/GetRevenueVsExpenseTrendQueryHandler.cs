using FinTrack.Application.Common;
using FinTrack.Application.Features.Dashboard.DTOs;
using FinTrack.Domain.Interfaces;
using MediatR;

namespace FinTrack.Application.Features.Dashboard.Queries;

public class GetRevenueVsExpenseTrendQueryHandler : IRequestHandler<GetRevenueVsExpenseTrendQuery, Result<RevenueVsExpenseTrendDto>>
{
    private readonly ITransactionRepository _transactionRepository;

    // Nomes dos meses abreviados em português — evita dependência de i18n no frontend
    private static readonly string[] MesesAbreviados =
        ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    public GetRevenueVsExpenseTrendQueryHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<RevenueVsExpenseTrendDto>> Handle(GetRevenueVsExpenseTrendQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var endDate = new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month), 23, 59, 59, DateTimeKind.Utc);
        var startDate = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(-(request.Months - 1));

        var raw = await _transactionRepository.GetMonthlyTrendAsync(
            request.UserId, startDate, endDate, cancellationToken);

        var items = raw.Select(x => new MonthlyTrendItemDto(
            x.Year,
            x.Month,
            $"{MesesAbreviados[x.Month - 1]}/{x.Year % 100:D2}",
            x.TotalIncome,
            x.TotalExpense,
            x.TotalIncome - x.TotalExpense
        ));

        return Result<RevenueVsExpenseTrendDto>.Success(new RevenueVsExpenseTrendDto(items));
    }
}

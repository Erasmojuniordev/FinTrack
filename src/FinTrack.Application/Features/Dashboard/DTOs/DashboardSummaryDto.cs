namespace FinTrack.Application.Features.Dashboard.DTOs;

public record DashboardSummaryDto(
    long TotalIncomeInCents,
    long TotalExpenseInCents,
    long BalanceInCents,
    decimal SavingsRatePercent
);

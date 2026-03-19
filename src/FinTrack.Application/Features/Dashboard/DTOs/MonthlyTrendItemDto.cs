namespace FinTrack.Application.Features.Dashboard.DTOs;

public record MonthlyTrendItemDto(
    int Year,
    int Month,
    string MonthLabel,
    long TotalIncomeInCents,
    long TotalExpenseInCents,
    long BalanceInCents
);

public record RevenueVsExpenseTrendDto(
    IEnumerable<MonthlyTrendItemDto> Items
);

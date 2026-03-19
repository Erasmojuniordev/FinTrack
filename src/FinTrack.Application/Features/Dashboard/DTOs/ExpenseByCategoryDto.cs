namespace FinTrack.Application.Features.Dashboard.DTOs;

public record ExpenseByCategoryDto(
    Guid? CategoryId,
    string CategoryName,
    string CategoryColor,
    long TotalInCents,
    decimal Percentage
);

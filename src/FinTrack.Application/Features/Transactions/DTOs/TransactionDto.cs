using FinTrack.Domain.Enums;

namespace FinTrack.Application.Features.Transactions.DTOs;

public record TransactionDto(
    Guid Id,
    string Description,
    long AmountInCents,
    TransactionType Type,
    DateTime Date,
    string? Notes,
    bool IsRecurring,
    Guid? CategoryId,
    string? CategoryName,
    string? CategoryColor,
    string? CategoryIcon,
    DateTime CreatedAt
);

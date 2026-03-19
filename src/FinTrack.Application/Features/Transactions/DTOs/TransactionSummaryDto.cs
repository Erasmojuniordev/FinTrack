namespace FinTrack.Application.Features.Transactions.DTOs;

/// <summary>
/// Resumo financeiro calculado a partir das transações retornadas numa query.
/// Usado no cabeçalho da listagem de transações para exibir totais do período.
/// </summary>
public record TransactionSummaryDto(
    long TotalIncomeInCents,
    long TotalExpenseInCents,
    long BalanceInCents
);

using FinTrack.Domain.Entities;
using FinTrack.Domain.Enums;

namespace FinTrack.Domain.Interfaces;

public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Transaction>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default);

    // Consulta paginada com filtros opcionais — usada pelo GetTransactionsQuery
    Task<(IEnumerable<Transaction> Items, int TotalCount)> GetFilteredAsync(
        Guid userId,
        DateTime? startDate,
        DateTime? endDate,
        Guid? categoryId,
        TransactionType? type,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default);
    Task UpdateAsync(Transaction transaction, CancellationToken cancellationToken = default);
    Task DeleteAsync(Transaction transaction, CancellationToken cancellationToken = default);

    // Métodos de agregação usados pelo dashboard
    Task<(long TotalIncome, long TotalExpense)> GetSummaryAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<(Guid? CategoryId, string CategoryName, string CategoryColor, long TotalInCents)>> GetExpensesByCategoryAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<(int Year, int Month, long TotalIncome, long TotalExpense)>> GetMonthlyTrendAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default);
}

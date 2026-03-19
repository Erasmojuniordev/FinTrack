using FinTrack.Domain.Entities;

namespace FinTrack.Domain.Interfaces;

public interface IRecurringTransactionRepository
{
    Task<RecurringTransaction?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<RecurringTransaction>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<RecurringTransaction>> GetActiveDueAsync(DateTime referenceDate, CancellationToken cancellationToken = default);
    Task AddAsync(RecurringTransaction recurringTransaction, CancellationToken cancellationToken = default);
    Task UpdateAsync(RecurringTransaction recurringTransaction, CancellationToken cancellationToken = default);
    Task DeleteAsync(RecurringTransaction recurringTransaction, CancellationToken cancellationToken = default);
}

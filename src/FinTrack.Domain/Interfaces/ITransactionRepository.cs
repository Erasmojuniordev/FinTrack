using FinTrack.Domain.Entities;

namespace FinTrack.Domain.Interfaces;

public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Transaction>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default);
    Task UpdateAsync(Transaction transaction, CancellationToken cancellationToken = default);
    Task DeleteAsync(Transaction transaction, CancellationToken cancellationToken = default);
}

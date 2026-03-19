using FinTrack.Domain.Entities;

namespace FinTrack.Domain.Interfaces;

public interface IFinScoreRepository
{
    Task<FinScoreHistory?> GetByMonthAsync(Guid userId, int month, int year, CancellationToken cancellationToken = default);
    Task<IEnumerable<FinScoreHistory>> GetHistoryAsync(Guid userId, int months, CancellationToken cancellationToken = default);
    Task AddAsync(FinScoreHistory finScoreHistory, CancellationToken cancellationToken = default);
    Task UpdateAsync(FinScoreHistory finScoreHistory, CancellationToken cancellationToken = default);
}

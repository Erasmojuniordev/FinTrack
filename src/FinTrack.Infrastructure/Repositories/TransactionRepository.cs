using FinTrack.Domain.Entities;
using FinTrack.Domain.Enums;
using FinTrack.Domain.Interfaces;
using FinTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Infrastructure.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _context;

    public TransactionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
        => await _context.Transactions
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId, cancellationToken);

    public async Task<IEnumerable<Transaction>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default)
        => await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .ToListAsync(cancellationToken);

    public async Task<(IEnumerable<Transaction> Items, int TotalCount)> GetFilteredAsync(
        Guid userId,
        DateTime? startDate,
        DateTime? endDate,
        Guid? categoryId,
        TransactionType? type,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .AsQueryable();

        if (startDate.HasValue)
            query = query.Where(t => t.Date >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(t => t.Date <= endDate.Value);

        if (categoryId.HasValue)
            query = query.Where(t => t.CategoryId == categoryId.Value);

        if (type.HasValue)
            query = query.Where(t => t.Type == type.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default)
    {
        await _context.Transactions.AddAsync(transaction, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Transaction transaction, CancellationToken cancellationToken = default)
    {
        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Transaction transaction, CancellationToken cancellationToken = default)
    {
        // Soft delete: apenas marca IsDeleted = true
        transaction.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<(long TotalIncome, long TotalExpense)> GetSummaryAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default)
    {
        var baseQuery = _context.Transactions
            .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate);

        var totalIncome = await baseQuery
            .Where(t => t.Type == TransactionType.Income)
            .SumAsync(t => (long?)t.AmountInCents, cancellationToken) ?? 0L;

        var totalExpense = await baseQuery
            .Where(t => t.Type == TransactionType.Expense)
            .SumAsync(t => (long?)t.AmountInCents, cancellationToken) ?? 0L;

        return (totalIncome, totalExpense);
    }

    public async Task<IEnumerable<(Guid? CategoryId, string CategoryName, string CategoryColor, long TotalInCents)>> GetExpensesByCategoryAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default)
    {
        var result = await _context.Transactions
            .Where(t => t.UserId == userId
                     && t.Type == TransactionType.Expense
                     && t.Date >= startDate
                     && t.Date <= endDate)
            .GroupBy(t => new
            {
                t.CategoryId,
                CategoryName = t.Category != null ? t.Category.Name : "Sem categoria",
                CategoryColor = t.Category != null ? t.Category.Color : "#64748B",
            })
            .Select(g => new
            {
                g.Key.CategoryId,
                g.Key.CategoryName,
                g.Key.CategoryColor,
                TotalInCents = g.Sum(t => t.AmountInCents),
            })
            .OrderByDescending(x => x.TotalInCents)
            .ToListAsync(cancellationToken);

        return result.Select(x => (x.CategoryId, x.CategoryName, x.CategoryColor, x.TotalInCents));
    }

    public async Task<IEnumerable<(int Year, int Month, long TotalIncome, long TotalExpense)>> GetMonthlyTrendAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default)
    {
        // Agrega por (Ano, Mês, Tipo) e pivota em memória — volume máximo é N meses × 2 tipos
        var raw = await _context.Transactions
            .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate)
            .GroupBy(t => new { t.Date.Year, t.Date.Month, t.Type })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                g.Key.Type,
                Total = g.Sum(t => t.AmountInCents),
            })
            .ToListAsync(cancellationToken);

        return raw
            .GroupBy(x => new { x.Year, x.Month })
            .Select(g => (
                g.Key.Year,
                g.Key.Month,
                TotalIncome: g.Where(x => x.Type == TransactionType.Income).Sum(x => x.Total),
                TotalExpense: g.Where(x => x.Type == TransactionType.Expense).Sum(x => x.Total)
            ))
            .OrderBy(x => x.Year).ThenBy(x => x.Month);
    }
}

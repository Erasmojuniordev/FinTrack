using FinTrack.Domain.Entities;
using FinTrack.Domain.Interfaces;
using FinTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Categories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

    // Retorna categorias do sistema (UserId == null) + categorias do próprio usuário
    public async Task<IEnumerable<Category>> GetAvailableForUserAsync(Guid userId, CancellationToken cancellationToken = default)
        => await _context.Categories
            .Where(c => c.UserId == null || c.UserId == userId)
            .OrderBy(c => c.IsDefault ? 0 : 1)
            .ThenBy(c => c.Name)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Category category, CancellationToken cancellationToken = default)
    {
        await _context.Categories.AddAsync(category, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Category category, CancellationToken cancellationToken = default)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Category category, CancellationToken cancellationToken = default)
    {
        // Soft delete: apenas marca IsDeleted = true
        category.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> HasTransactionsAsync(Guid categoryId, CancellationToken cancellationToken = default)
        => await _context.Transactions.AnyAsync(t => t.CategoryId == categoryId, cancellationToken);
}

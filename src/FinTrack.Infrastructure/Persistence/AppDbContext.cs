using FinTrack.Domain.Common;
using FinTrack.Domain.Entities;
using FinTrack.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<RecurringTransaction> RecurringTransactions => Set<RecurringTransaction>();
    public DbSet<FinScoreHistory> FinScoreHistories => Set<FinScoreHistory>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Aplica todas as configurações do assembly automaticamente
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Global Query Filter: exclui registros com soft delete de todas as queries
        builder.Entity<Transaction>().HasQueryFilter(t => !t.IsDeleted);
        builder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);

        // Prefixo nas tabelas do Identity para organização
        builder.Entity<ApplicationUser>().ToTable("users");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityRole>().ToTable("roles");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserRole<string>>().ToTable("user_roles");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserClaim<string>>().ToTable("user_claims");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserLogin<string>>().ToTable("user_logins");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>>().ToTable("role_claims");
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserToken<string>>().ToTable("user_tokens");
    }
}

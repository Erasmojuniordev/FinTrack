using FinTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTrack.Infrastructure.Persistence.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("transactions");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Description).IsRequired().HasMaxLength(200);
        builder.Property(t => t.AmountInCents).IsRequired();
        builder.Property(t => t.Type).IsRequired();
        builder.Property(t => t.Date).IsRequired();
        builder.Property(t => t.Notes).HasMaxLength(500);
        builder.Property(t => t.IsDeleted).HasDefaultValue(false);

        // Índice composto para as queries mais comuns (filtro por usuário + data)
        builder.HasIndex(t => new { t.UserId, t.Date });
        builder.HasIndex(t => t.UserId);

        builder.HasOne(t => t.Category)
            .WithMany(c => c.Transactions)
            .HasForeignKey(t => t.CategoryId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(t => t.RecurringTransaction)
            .WithMany(r => r.GeneratedTransactions)
            .HasForeignKey(t => t.RecurringTransactionId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

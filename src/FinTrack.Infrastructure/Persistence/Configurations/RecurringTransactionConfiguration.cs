using FinTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTrack.Infrastructure.Persistence.Configurations;

public class RecurringTransactionConfiguration : IEntityTypeConfiguration<RecurringTransaction>
{
    public void Configure(EntityTypeBuilder<RecurringTransaction> builder)
    {
        builder.ToTable("recurring_transactions");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Description).IsRequired().HasMaxLength(200);
        builder.Property(r => r.AmountInCents).IsRequired();
        builder.Property(r => r.ExecutionDay).IsRequired();
        builder.Property(r => r.IsActive).HasDefaultValue(true);

        builder.HasIndex(r => r.UserId);

        builder.HasOne(r => r.Category)
            .WithMany()
            .HasForeignKey(r => r.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

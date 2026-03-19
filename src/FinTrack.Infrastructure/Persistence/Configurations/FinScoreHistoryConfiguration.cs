using FinTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTrack.Infrastructure.Persistence.Configurations;

public class FinScoreHistoryConfiguration : IEntityTypeConfiguration<FinScoreHistory>
{
    public void Configure(EntityTypeBuilder<FinScoreHistory> builder)
    {
        builder.ToTable("finscore_history");
        builder.HasKey(f => f.Id);

        builder.Property(f => f.Score).IsRequired();
        builder.Property(f => f.ReferenceMonth).IsRequired();
        builder.Property(f => f.ReferenceYear).IsRequired();
        // Armazenado como jsonb no PostgreSQL para flexibilidade do breakdown
        builder.Property(f => f.Breakdown).HasColumnType("jsonb").HasDefaultValue("{}");

        builder.HasIndex(f => new { f.UserId, f.ReferenceYear, f.ReferenceMonth }).IsUnique();
    }
}

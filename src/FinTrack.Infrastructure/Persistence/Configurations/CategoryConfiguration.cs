using FinTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTrack.Infrastructure.Persistence.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categories");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Color).IsRequired().HasMaxLength(7);
        builder.Property(c => c.Icon).IsRequired().HasMaxLength(50);
        builder.Property(c => c.IsDefault).HasDefaultValue(false);
        builder.Property(c => c.IsDeleted).HasDefaultValue(false);

        builder.HasIndex(c => c.UserId);

        // Seed das categorias padrão do sistema (UserId = null = compartilhadas)
        builder.HasData(
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000001"), Name = "Moradia", Color = "#6366F1", Icon = "home", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000002"), Name = "Alimentação", Color = "#F59E0B", Icon = "utensils", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000003"), Name = "Transporte", Color = "#3B82F6", Icon = "car", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000004"), Name = "Saúde", Color = "#EF4444", Icon = "heart-pulse", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000005"), Name = "Educação", Color = "#8B5CF6", Icon = "graduation-cap", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000006"), Name = "Lazer", Color = "#EC4899", Icon = "gamepad-2", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000007"), Name = "Investimentos", Color = "#10B981", Icon = "trending-up", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000008"), Name = "Salário", Color = "#059669", Icon = "briefcase", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000009"), Name = "Freelance", Color = "#0EA5E9", Icon = "laptop", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = new Guid("10000000-0000-0000-0000-000000000010"), Name = "Outros", Color = "#94A3B8", Icon = "tag", IsDefault = true, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc), UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}

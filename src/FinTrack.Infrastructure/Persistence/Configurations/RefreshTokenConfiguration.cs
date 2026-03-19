using FinTrack.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTrack.Infrastructure.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("refresh_tokens");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Token).IsRequired().HasMaxLength(512);
        builder.Property(r => r.IsRevoked).HasDefaultValue(false);

        // Índice no hash do token para busca rápida na validação
        builder.HasIndex(r => r.Token);
        builder.HasIndex(r => r.UserId);

        builder.HasOne(r => r.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

namespace FinTrack.Infrastructure.Identity;

public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Armazenado como hash SHA256 — nunca o token bruto
    public string Token { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime CreatedAt { get; set; }

    public ApplicationUser? User { get; set; }
}

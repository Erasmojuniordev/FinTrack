using Microsoft.AspNetCore.Identity;

namespace FinTrack.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string PreferredCurrency { get; set; } = "BRL";
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}

using FinTrack.Application.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace FinTrack.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public IdentityService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<(bool Success, string? Error)> RegisterAsync(string name, string email, string password)
    {
        var user = new ApplicationUser
        {
            Name = name,
            UserName = email,
            Email = email,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var error = string.Join(" | ", result.Errors.Select(e => e.Description));
            return (false, error);
        }

        return (true, null);
    }

    public async Task<(bool Success, string? UserId, string? UserName, string? Error)> ValidateCredentialsAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
            return (false, null, null, "Credenciais inválidas.");

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            var error = result.IsLockedOut ? "Conta bloqueada temporariamente. Tente novamente em alguns minutos." : "Credenciais inválidas.";
            return (false, null, null, error);
        }

        return (true, user.Id, user.Name, null);
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        return user is not null;
    }

    public async Task<(string? UserId, string? UserName, string? UserEmail)> GetUserByIdAsync(string identifier)
    {
        // Aceita tanto userId quanto email como identificador
        var user = identifier.Contains('@')
            ? await _userManager.FindByEmailAsync(identifier)
            : await _userManager.FindByIdAsync(identifier);

        if (user is null) return (null, null, null);
        return (user.Id, user.Name, user.Email);
    }
}

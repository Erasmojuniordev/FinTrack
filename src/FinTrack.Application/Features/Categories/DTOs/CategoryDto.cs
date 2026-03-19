namespace FinTrack.Application.Features.Categories.DTOs;

public record CategoryDto(
    Guid Id,
    string Name,
    string Color,
    string Icon,
    bool IsDefault,
    bool IsSystem  // true = categoria do sistema (UserId == null)
);

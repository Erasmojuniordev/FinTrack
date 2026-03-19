using FinTrack.Domain.Common;

namespace FinTrack.Domain.Entities;

public class Category : AuditableEntity
{
    // Null indica categoria padrão do sistema (compartilhada entre todos os usuários)
    public Guid? UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = "#3B82F6";
    public string Icon { get; set; } = "tag";
    public bool IsDefault { get; set; }
    public bool IsDeleted { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = [];
}

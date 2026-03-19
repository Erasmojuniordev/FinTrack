namespace FinTrack.Domain.Common;

public abstract class AuditableEntity : BaseEntity
{
    public string CreatedBy { get; set; } = string.Empty;
}

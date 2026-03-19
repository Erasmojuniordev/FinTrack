using FinTrack.Domain.Common;
using FinTrack.Domain.Enums;

namespace FinTrack.Domain.Entities;

public class Transaction : AuditableEntity
{
    public Guid UserId { get; set; }
    public string Description { get; set; } = string.Empty;
    public long AmountInCents { get; set; }
    public TransactionType Type { get; set; }
    public Guid? CategoryId { get; set; }
    public DateTime Date { get; set; }
    public string? Notes { get; set; }
    public bool IsRecurring { get; set; }
    public Guid? RecurringTransactionId { get; set; }
    public bool IsDeleted { get; set; }

    // Navegação
    public Category? Category { get; set; }
    public RecurringTransaction? RecurringTransaction { get; set; }
}

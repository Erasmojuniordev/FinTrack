using FinTrack.Domain.Common;
using FinTrack.Domain.Enums;

namespace FinTrack.Domain.Entities;

public class RecurringTransaction : AuditableEntity
{
    public Guid UserId { get; set; }
    public string Description { get; set; } = string.Empty;
    public long AmountInCents { get; set; }
    public TransactionType Type { get; set; }
    public Guid CategoryId { get; set; }
    public RecurrenceFrequency Frequency { get; set; }

    // Dia do mês para execução (1-28). Para weekly, representa o dia da semana (0=Domingo).
    public int ExecutionDay { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastExecutedAt { get; set; }

    // Navegação
    public Category? Category { get; set; }
    public ICollection<Transaction> GeneratedTransactions { get; set; } = [];
}

using FinTrack.Domain.Common;

namespace FinTrack.Domain.Entities;

public class FinScoreHistory : BaseEntity
{
    public Guid UserId { get; set; }
    public int Score { get; set; }
    public int ReferenceMonth { get; set; }
    public int ReferenceYear { get; set; }

    // JSON com o breakdown por indicador: { "spendingRatio": 85, "regularity": 70, ... }
    public string Breakdown { get; set; } = "{}";
    public DateTime CalculatedAt { get; set; }
}

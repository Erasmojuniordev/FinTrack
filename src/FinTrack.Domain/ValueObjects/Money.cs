namespace FinTrack.Domain.ValueObjects;

/// <summary>
/// Value Object que representa um valor monetário armazenado em centavos para evitar erros de ponto flutuante.
/// </summary>
public sealed class Money : IEquatable<Money>
{
    public long AmountInCents { get; }
    public string Currency { get; }

    private Money(long amountInCents, string currency)
    {
        AmountInCents = amountInCents;
        Currency = currency;
    }

    public static Money FromCents(long amountInCents, string currency = "BRL")
        => new(amountInCents, currency);

    public static Money FromDecimal(decimal amount, string currency = "BRL")
        => new((long)(amount * 100), currency);

    public decimal ToDecimal() => AmountInCents / 100m;

    public bool Equals(Money? other)
    {
        if (other is null) return false;
        return AmountInCents == other.AmountInCents && Currency == other.Currency;
    }

    public override bool Equals(object? obj) => obj is Money other && Equals(other);
    public override int GetHashCode() => HashCode.Combine(AmountInCents, Currency);
    public override string ToString() => $"{ToDecimal():F2} {Currency}";

    public static bool operator ==(Money? left, Money? right) => left?.Equals(right) ?? right is null;
    public static bool operator !=(Money? left, Money? right) => !(left == right);
}

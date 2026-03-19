using FinTrack.Application.Features.Transactions.Commands;
using FluentValidation;

namespace FinTrack.Application.Features.Transactions.Validators;

public class CreateTransactionCommandValidator : AbstractValidator<CreateTransactionCommand>
{
    public CreateTransactionCommandValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("A descrição é obrigatória.")
            .MaximumLength(200).WithMessage("A descrição deve ter no máximo 200 caracteres.");

        RuleFor(x => x.AmountInCents)
            .GreaterThan(0).WithMessage("O valor deve ser maior que zero.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Tipo de transação inválido.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("A data é obrigatória.")
            .LessThanOrEqualTo(DateTime.UtcNow.AddDays(1))
            .WithMessage("A data não pode ser futura.");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("As observações devem ter no máximo 500 caracteres.")
            .When(x => x.Notes is not null);
    }
}

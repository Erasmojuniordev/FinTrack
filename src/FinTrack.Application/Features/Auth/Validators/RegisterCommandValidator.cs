using FinTrack.Application.Features.Auth.Commands;
using FluentValidation;

namespace FinTrack.Application.Features.Auth.Validators;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MinimumLength(2).WithMessage("O nome deve ter ao menos 2 caracteres.")
            .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("O e-mail é obrigatório.")
            .EmailAddress().WithMessage("Informe um e-mail válido.")
            .MaximumLength(256).WithMessage("O e-mail deve ter no máximo 256 caracteres.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("A senha é obrigatória.")
            .MinimumLength(8).WithMessage("A senha deve ter ao menos 8 caracteres.")
            .MaximumLength(100).WithMessage("A senha deve ter no máximo 100 caracteres.")
            .Matches("[A-Z]").WithMessage("A senha deve conter ao menos uma letra maiúscula.")
            .Matches("[0-9]").WithMessage("A senha deve conter ao menos um número.");
    }
}

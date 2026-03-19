using FinTrack.Application.Features.Auth.Commands;
using FluentValidation;

namespace FinTrack.Application.Features.Auth.Validators;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("O e-mail é obrigatório.")
            .EmailAddress().WithMessage("Informe um e-mail válido.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("A senha é obrigatória.");
    }
}

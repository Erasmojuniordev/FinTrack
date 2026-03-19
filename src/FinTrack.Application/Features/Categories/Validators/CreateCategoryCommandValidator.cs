using FinTrack.Application.Features.Categories.Commands;
using FluentValidation;

namespace FinTrack.Application.Features.Categories.Validators;

public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(50).WithMessage("O nome deve ter no máximo 50 caracteres.");

        RuleFor(x => x.Color)
            .NotEmpty().WithMessage("A cor é obrigatória.")
            .Matches(@"^#([A-Fa-f0-9]{6})$").WithMessage("Informe uma cor hexadecimal válida (ex: #3B82F6).");

        RuleFor(x => x.Icon)
            .NotEmpty().WithMessage("O ícone é obrigatório.")
            .MaximumLength(50).WithMessage("O ícone deve ter no máximo 50 caracteres.");
    }
}

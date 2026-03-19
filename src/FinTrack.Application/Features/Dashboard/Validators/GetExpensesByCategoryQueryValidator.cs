using FinTrack.Application.Features.Dashboard.Queries;
using FluentValidation;

namespace FinTrack.Application.Features.Dashboard.Validators;

public class GetExpensesByCategoryQueryValidator : AbstractValidator<GetExpensesByCategoryQuery>
{
    public GetExpensesByCategoryQueryValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.StartDate).LessThanOrEqualTo(x => x.EndDate)
            .WithMessage("A data inicial deve ser anterior ou igual à data final.");
    }
}

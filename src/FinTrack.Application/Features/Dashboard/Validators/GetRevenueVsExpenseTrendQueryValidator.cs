using FinTrack.Application.Features.Dashboard.Queries;
using FluentValidation;

namespace FinTrack.Application.Features.Dashboard.Validators;

public class GetRevenueVsExpenseTrendQueryValidator : AbstractValidator<GetRevenueVsExpenseTrendQuery>
{
    public GetRevenueVsExpenseTrendQueryValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Months).InclusiveBetween(1, 24)
            .WithMessage("O período de tendência deve ser entre 1 e 24 meses.");
    }
}

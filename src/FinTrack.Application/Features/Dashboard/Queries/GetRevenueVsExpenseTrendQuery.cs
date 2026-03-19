using FinTrack.Application.Common;
using FinTrack.Application.Features.Dashboard.DTOs;
using MediatR;

namespace FinTrack.Application.Features.Dashboard.Queries;

public record GetRevenueVsExpenseTrendQuery(
    Guid UserId,
    int Months = 6
) : IRequest<Result<RevenueVsExpenseTrendDto>>;

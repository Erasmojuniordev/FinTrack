using FinTrack.Application.Common;
using FinTrack.Application.Features.Dashboard.DTOs;
using MediatR;

namespace FinTrack.Application.Features.Dashboard.Queries;

public record GetDashboardSummaryQuery(
    Guid UserId,
    DateTime StartDate,
    DateTime EndDate
) : IRequest<Result<DashboardSummaryDto>>;

using FinTrack.Application.Common;
using MediatR;

namespace FinTrack.Application.Features.Transactions.Commands;

public record DeleteTransactionCommand(Guid Id, Guid UserId) : IRequest<Result<bool>>;

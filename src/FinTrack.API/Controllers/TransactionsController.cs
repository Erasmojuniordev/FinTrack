using FinTrack.Application.Features.Transactions.Commands;
using FinTrack.Application.Features.Transactions.Queries;
using FinTrack.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinTrack.API.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransactionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>
    /// Lista transações com paginação e filtros opcionais.
    /// Inclui resumo financeiro (receitas, despesas e saldo do período).
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] Guid? categoryId,
        [FromQuery] TransactionType? type,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetTransactionsQuery(
            GetUserId(), startDate, endDate, categoryId, type, page, pageSize);

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result.Value);
    }

    /// <summary>Retorna uma transação pelo ID.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetTransactionByIdQuery(id, GetUserId()), cancellationToken);

        if (!result.IsSuccess)
            return StatusCode(result.StatusCode, new { error = result.Error });

        return Ok(result.Value);
    }

    /// <summary>Cria uma nova transação.</summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateTransactionRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateTransactionCommand(
            GetUserId(),
            request.Description,
            request.AmountInCents,
            request.Type,
            request.Date,
            request.CategoryId,
            request.Notes,
            request.IsRecurring);

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.IsSuccess)
            return StatusCode(result.StatusCode, new { error = result.Error });

        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
    }

    /// <summary>Atualiza uma transação existente.</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTransactionRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateTransactionCommand(
            id,
            GetUserId(),
            request.Description,
            request.AmountInCents,
            request.Type,
            request.Date,
            request.CategoryId,
            request.Notes,
            request.IsRecurring);

        var result = await _mediator.Send(command, cancellationToken);

        if (!result.IsSuccess)
            return StatusCode(result.StatusCode, new { error = result.Error });

        return Ok(result.Value);
    }

    /// <summary>Exclui uma transação (soft delete).</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DeleteTransactionCommand(id, GetUserId()), cancellationToken);

        if (!result.IsSuccess)
            return StatusCode(result.StatusCode, new { error = result.Error });

        return NoContent();
    }
}

public record CreateTransactionRequest(
    string Description,
    long AmountInCents,
    TransactionType Type,
    DateTime Date,
    Guid? CategoryId,
    string? Notes,
    bool IsRecurring = false);

public record UpdateTransactionRequest(
    string Description,
    long AmountInCents,
    TransactionType Type,
    DateTime Date,
    Guid? CategoryId,
    string? Notes,
    bool IsRecurring = false);

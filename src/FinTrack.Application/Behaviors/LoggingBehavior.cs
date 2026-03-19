using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace FinTrack.Application.Behaviors;

/// <summary>
/// Pipeline Behavior que registra o nome do request e o tempo de execução de cada handler.
/// </summary>
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        _logger.LogInformation("Iniciando handler: {RequestName}", requestName);

        var stopwatch = Stopwatch.StartNew();
        var response = await next();
        stopwatch.Stop();

        _logger.LogInformation("Handler concluído: {RequestName} em {ElapsedMs}ms",
            requestName, stopwatch.ElapsedMilliseconds);

        return response;
    }
}

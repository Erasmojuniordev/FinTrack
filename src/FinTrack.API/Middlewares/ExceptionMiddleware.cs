using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace FinTrack.API.Middlewares;

/// <summary>
/// Captura exceções não tratadas e retorna uma resposta ProblemDetails padronizada (RFC 7807).
/// Evita vazar detalhes internos em produção.
/// </summary>
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exceção não tratada: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var problem = new ProblemDetails
        {
            Status = (int)HttpStatusCode.InternalServerError,
            Title = "Erro interno do servidor.",
            Detail = _environment.IsDevelopment() ? exception.Message : "Ocorreu um erro inesperado. Tente novamente.",
            Instance = context.Request.Path
        };

        var json = JsonSerializer.Serialize(problem, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}

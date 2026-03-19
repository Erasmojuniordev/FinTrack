using FluentValidation;
using MediatR;
using FinTrack.Application.Common;

namespace FinTrack.Application.Behaviors;

/// <summary>
/// Pipeline Behavior que executa automaticamente os validators FluentValidation
/// antes de qualquer handler. Se houver erros, retorna Result.Failure sem chamar o handler.
/// </summary>
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : class
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
            return await next();

        var context = new ValidationContext<TRequest>(request);
        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();

        if (failures.Count == 0)
            return await next();

        // Concatena todas as mensagens de erro em uma string única
        var errorMessage = string.Join(" | ", failures.Select(f => f.ErrorMessage));

        // Usa reflexão para criar Result<T>.Failure com o tipo correto de retorno
        var resultType = typeof(TResponse);
        if (resultType.IsGenericType && resultType.GetGenericTypeDefinition() == typeof(Result<>))
        {
            var failureMethod = resultType.GetMethod("Failure",
                System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public);

            if (failureMethod is not null)
                return (TResponse)failureMethod.Invoke(null, [errorMessage, 400])!;
        }

        throw new ValidationException(failures);
    }
}

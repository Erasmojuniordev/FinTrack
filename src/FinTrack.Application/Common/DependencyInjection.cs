using FinTrack.Application.Behaviors;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace FinTrack.Application.Common;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(DependencyInjection).Assembly;

        // Registra todos os handlers do assembly
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));

        // Registra todos os validators do assembly
        services.AddValidatorsFromAssembly(assembly);

        // Pipeline: Logging → Validation → Handler
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        return services;
    }
}

namespace FinTrack.Application.Common;

/// <summary>
/// Padrão Result para retorno de handlers. Evita o uso de exceptions para controle de fluxo previsível.
/// Handlers sempre retornam Result&lt;T&gt;; o controller decide o HTTP status code com base em StatusCode.
/// </summary>
public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }
    public int StatusCode { get; }

    private Result(bool isSuccess, T? value, string? error, int statusCode)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
        StatusCode = statusCode;
    }

    public static Result<T> Success(T value) => new(true, value, null, 200);
    public static Result<T> Created(T value) => new(true, value, null, 201);
    public static Result<T> NoContent() => new(true, default, null, 204);
    public static Result<T> Failure(string error, int statusCode = 400) => new(false, default, error, statusCode);
    public static Result<T> NotFound(string error = "Recurso não encontrado.") => new(false, default, error, 404);
    public static Result<T> Unauthorized(string error = "Não autorizado.") => new(false, default, error, 401);
    public static Result<T> Conflict(string error) => new(false, default, error, 409);
}

# FinTrack — Documentação Técnica

**Versão:** 1.0 — Fase 1 (Fundação)
**Data:** Março 2026
**Stack:** .NET 8 · React 18 · TypeScript · PostgreSQL

---

## Índice

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Arquitetura — Clean Architecture](#2-arquitetura--clean-architecture)
3. [Backend — Camadas e Responsabilidades](#3-backend--camadas-e-responsabilidades)
4. [Padrões de Projeto Implementados](#4-padrões-de-projeto-implementados)
5. [Modelo de Dados](#5-modelo-de-dados)
6. [Autenticação e Segurança](#6-autenticação-e-segurança)
7. [API Endpoints](#7-api-endpoints)
8. [Frontend — Arquitetura React](#8-frontend--arquitetura-react)
9. [Design System](#9-design-system)
10. [Configuração de Ambiente](#10-configuração-de-ambiente)
11. [Execução Local](#11-execução-local)
12. [Roadmap de Fases](#12-roadmap-de-fases)

---

## 1. Visão Geral do Sistema

FinTrack é um sistema de controle financeiro pessoal com foco em **inteligência analítica**. Vai além do simples registro de entradas e saídas, oferecendo uma visão integrada da saúde financeira do usuário através de:

- **FinScore:** Score proprietário de saúde financeira (0–100) calculado com 5 indicadores ponderados
- **Motor de Projeções:** Algoritmos de previsão de gastos futuros e detecção de anomalias
- **Dashboard Interativo:** Visualizações animadas com drill-down, comparação temporal e gráficos responsivos

O sistema serve também como **peça de portfólio profissional**, demonstrando domínio de:
- Clean Architecture com separação rigorosa de responsabilidades
- Padrões CQRS, Mediator, Repository e Result
- Segurança de aplicações web (JWT, refresh token rotation, rate limiting)
- UI/UX moderno com React 18, TypeScript strict e animações Framer Motion

---

## 2. Arquitetura — Clean Architecture

### Princípio Fundamental

A dependência flui **sempre de fora para dentro**. Camadas externas conhecem as internas, nunca o contrário. O Domain é completamente isolado — não conhece nada além de si mesmo.

```
┌─────────────────────────────────────────┐
│               FinTrack.API              │  ← Camada mais externa
│  (Controllers, Middlewares, Program.cs) │
├─────────────────────────────────────────┤
│          FinTrack.Infrastructure        │
│  (EF Core, Identity, JWT, Serilog)      │
├─────────────────────────────────────────┤
│           FinTrack.Application          │
│  (Use Cases: Commands/Queries, DTOs)    │
├─────────────────────────────────────────┤
│             FinTrack.Domain             │  ← Camada mais interna
│  (Entidades, Value Objects, Interfaces) │
└─────────────────────────────────────────┘
```

### Referências entre Projetos

```
FinTrack.API
  └── FinTrack.Infrastructure
        └── FinTrack.Application
              └── FinTrack.Domain
```

Nenhuma seta aponta para cima. O `Domain` não referencia nada externo.

### Estrutura de Pastas

```
FinTrack/
├── CLAUDE.md                          # Guia de desenvolvimento para IA
├── .gitignore
├── FinTrack.sln
├── src/
│   ├── FinTrack.Domain/
│   │   ├── Common/                    # BaseEntity, AuditableEntity
│   │   ├── Entities/                  # Transaction, Category, RecurringTransaction, FinScoreHistory
│   │   ├── Enums/                     # TransactionType, RecurrenceFrequency
│   │   ├── Interfaces/                # ITransactionRepository, ICategoryRepository, etc.
│   │   └── ValueObjects/              # Money
│   ├── FinTrack.Application/
│   │   ├── Behaviors/                 # ValidationBehavior, LoggingBehavior
│   │   ├── Common/                    # Result<T>, PagedList<T>, DependencyInjection
│   │   ├── Features/
│   │   │   └── Auth/
│   │   │       ├── Commands/          # Register, Login, RefreshToken, Logout
│   │   │       ├── DTOs/              # AuthResponseDto
│   │   │       └── Validators/        # RegisterCommandValidator, LoginCommandValidator
│   │   └── Interfaces/                # ITokenService, IIdentityService, IRefreshTokenRepository
│   ├── FinTrack.Infrastructure/
│   │   ├── Common/                    # DependencyInjection
│   │   ├── Identity/                  # ApplicationUser, RefreshToken, TokenService, IdentityService
│   │   ├── Persistence/
│   │   │   ├── AppDbContext.cs
│   │   │   ├── Configurations/        # IEntityTypeConfiguration por entidade
│   │   │   └── Interceptors/          # AuditableEntityInterceptor
│   │   └── Repositories/              # RefreshTokenRepository
│   └── FinTrack.API/
│       ├── Controllers/               # AuthController
│       ├── Middlewares/               # ExceptionMiddleware
│       ├── Program.cs
│       └── appsettings.json
├── tests/
│   ├── FinTrack.Domain.Tests/
│   ├── FinTrack.Application.Tests/
│   └── FinTrack.API.Tests/
└── fintrack-web/                      # Frontend React 18
    └── src/
        ├── app/                       # App.tsx, routes.tsx, providers.tsx
        ├── components/
        │   ├── ui/                    # Button, Input, Card
        │   ├── layout/                # AuthLayout
        │   ├── charts/                # (Fase 3)
        │   └── features/              # (Fase 2+)
        ├── hooks/                     # useAuth
        ├── pages/                     # LoginPage, RegisterPage, DashboardPage
        ├── services/                  # api.ts (Axios), authService.ts
        ├── stores/                    # authStore (Zustand), uiStore
        ├── types/                     # auth.ts, api.ts
        └── utils/                     # cn.ts, formatCurrency.ts
```

---

## 3. Backend — Camadas e Responsabilidades

### 3.1 FinTrack.Domain

A camada mais interna. **Zero dependências externas** — apenas .NET BCL.

#### Hierarquia de Entidades Base

```csharp
// Raiz de todas as entidades. Id gerado automaticamente como Guid.
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; }  // UTC, preenchido pelo interceptor
    public DateTime UpdatedAt { get; set; }  // UTC, atualizado em todo SaveChanges
}

// Entidades que precisam de rastreamento de quem criou.
public abstract class AuditableEntity : BaseEntity
{
    public string CreatedBy { get; set; } = string.Empty;  // UserId do criador
}
```

#### Value Object: Money

Representa valores monetários com precisão máxima, evitando erros de ponto flutuante:

```csharp
// Sempre armazenado como centavos (long) no banco.
// Conversão para decimal apenas para exibição no frontend.
var price = Money.FromDecimal(1500.50m);   // 150050 centavos internamente
var display = price.ToDecimal();            // 1500.50 para o frontend
```

#### Enums do Domínio

```csharp
public enum TransactionType   { Income = 1, Expense = 2 }
public enum RecurrenceFrequency { Weekly = 1, Monthly = 2, Yearly = 3 }
```

#### Interfaces de Repositório

Definidas no Domain, implementadas na Infrastructure. Permitem trocar a implementação de persistência sem alterar a lógica de negócio:

- `ITransactionRepository` — CRUD de transações financeiras
- `ICategoryRepository` — CRUD de categorias com verificação de uso
- `IRecurringTransactionRepository` — CRUD de recorrências + busca de vencidas
- `IFinScoreRepository` — Histórico do FinScore por mês/ano

---

### 3.2 FinTrack.Application

Orquestra os use cases. Depende apenas do Domain.

#### Result Pattern

Substitui o uso de exceptions para fluxos de controle previsíveis. Cada handler retorna `Result<T>`:

```csharp
// Em vez de lançar exceção, o handler retorna:
return Result<AuthResponseDto>.Conflict("E-mail já cadastrado.");

// O controller lê o StatusCode e decide o HTTP response:
if (!result.IsSuccess)
    return StatusCode(result.StatusCode, new { error = result.Error });
```

Variantes disponíveis:
- `Result<T>.Success(value)` → HTTP 200
- `Result<T>.Created(value)` → HTTP 201
- `Result<T>.NoContent()` → HTTP 204
- `Result<T>.Failure(error)` → HTTP 400 (padrão)
- `Result<T>.NotFound(error)` → HTTP 404
- `Result<T>.Unauthorized(error)` → HTTP 401
- `Result<T>.Conflict(error)` → HTTP 409

#### Pipeline MediatR

Antes de cada handler ser chamado, dois behaviors executam em ordem:

```
Request → LoggingBehavior → ValidationBehavior → Handler → Response
```

**LoggingBehavior:** Registra nome do request e tempo de execução (ms).

**ValidationBehavior:** Executa todos os `IValidator<TRequest>` registrados. Se houver falhas de validação, retorna `Result<T>.Failure` com as mensagens concatenadas — o handler **nunca é chamado**.

#### Interfaces de Serviço (Inversão de Dependência)

Para evitar que o Application dependa de bibliotecas externas (Identity, JWT), são definidas interfaces que a Infrastructure implementa:

```csharp
// O Application só conhece a interface, não a implementação concreta com JWT.
public interface ITokenService
{
    string GenerateAccessToken(string userId, string email, string name);
    string GenerateRefreshToken();
    string HashToken(string token);
    DateTime GetAccessTokenExpiration();
}

// Abstrai o UserManager e SignInManager do Identity.
public interface IIdentityService
{
    Task<(bool Success, string? Error)> RegisterAsync(string name, string email, string password);
    Task<(bool Success, string? UserId, string? UserName, string? Error)> ValidateCredentialsAsync(string email, string password);
    Task<bool> UserExistsAsync(string email);
    Task<(string? UserId, string? UserName, string? UserEmail)> GetUserByIdAsync(string identifier);
}
```

#### Fluxo de um Use Case (exemplo: Login)

```
AuthController.Login(LoginCommand)
  └── IMediator.Send(LoginCommand)
        ├── LoggingBehavior: loga "Iniciando handler: LoginCommand"
        ├── ValidationBehavior: valida email + password (LoginCommandValidator)
        └── LoginCommandHandler.Handle()
              ├── IIdentityService.ValidateCredentialsAsync()
              ├── ITokenService.GenerateAccessToken()
              ├── ITokenService.GenerateRefreshToken()
              ├── ITokenService.HashToken()     ← hash antes de persistir
              ├── IRefreshTokenRepository.SaveAsync()
              └── return Result<AuthResponseDto>.Success(...)
```

---

### 3.3 FinTrack.Infrastructure

Implementações concretas. Depende do Domain e Application.

#### AppDbContext

Herda de `IdentityDbContext<ApplicationUser>` para integrar o Identity ao EF Core:

```csharp
public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    // DbSets principais
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Category> Categories => Set<Category>();
    // ...

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Aplica automaticamente todos os IEntityTypeConfiguration do assembly
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Global Query Filters: soft delete transparente em todas as queries
        builder.Entity<Transaction>().HasQueryFilter(t => !t.IsDeleted);
        builder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);
    }
}
```

#### AuditableEntityInterceptor

Implementa `SaveChangesInterceptor` do EF Core para preencher `CreatedAt`/`UpdatedAt` automaticamente, sem que o código de negócio precise se preocupar:

```csharp
// Chamado pelo EF Core antes de cada SaveChanges
private static void UpdateAuditFields(DbContext context)
{
    foreach (var entry in context.ChangeTracker.Entries<BaseEntity>())
    {
        if (entry.State == EntityState.Added)
            entry.Entity.CreatedAt = entry.Entity.UpdatedAt = DateTime.UtcNow;
        else if (entry.State == EntityState.Modified)
            entry.Entity.UpdatedAt = DateTime.UtcNow;
    }
}
```

#### TokenService

- **Access Token:** JWT assinado com HS256, TTL 15 minutos. Claims: `sub` (userId), `email`, `name`, `jti` (ID único do token)
- **Refresh Token:** 64 bytes aleatórios gerados com `RandomNumberGenerator` (criptograficamente seguro), convertidos para Base64
- **Segurança:** O refresh token é **hasheado com SHA256** antes de persistir no banco. O token bruto (texto plano) é enviado apenas ao cliente via cookie httpOnly — nunca armazenado diretamente

#### Seed de Categorias

10 categorias padrão do sistema são inseridas via `HasData()` no `CategoryConfiguration`, executadas na migration inicial:

| Nome | Ícone | Cor |
|---|---|---|
| Moradia | home | #6366F1 |
| Alimentação | utensils | #F59E0B |
| Transporte | car | #3B82F6 |
| Saúde | heart-pulse | #EF4444 |
| Educação | graduation-cap | #8B5CF6 |
| Lazer | gamepad-2 | #EC4899 |
| Investimentos | trending-up | #10B981 |
| Salário | briefcase | #059669 |
| Freelance | laptop | #0EA5E9 |
| Outros | tag | #94A3B8 |

Categorias padrão têm `UserId = null`, significando que são compartilhadas entre todos os usuários.

---

### 3.4 FinTrack.API

Controllers finos que delegam tudo ao MediatR.

#### Program.cs — Composição da Aplicação

```
builder.Services
  .AddApplication()          ← MediatR + FluentValidation + Behaviors
  .AddInfrastructure()       ← DbContext + Identity + JWT + Serilog + Repositórios

app.UseMiddleware<ExceptionMiddleware>()   ← ProblemDetails em exceções não tratadas
app.UseHttpsRedirection()
app.UseCors("Frontend")                   ← Apenas http://localhost:5173 em dev
app.UseRateLimiter()                      ← 5/min no endpoint de login
app.UseAuthentication()
app.UseAuthorization()
app.MapControllers()
```

#### ExceptionMiddleware

Captura qualquer `Exception` não tratada e retorna `ProblemDetails` (RFC 7807). Em produção, oculta os detalhes internos:

```json
{
  "status": 500,
  "title": "Erro interno do servidor.",
  "detail": "Ocorreu um erro inesperado. Tente novamente.",
  "instance": "/api/transactions"
}
```

Em desenvolvimento, `detail` contém a mensagem original da exceção.

---

## 4. Padrões de Projeto Implementados

### CQRS (Command Query Responsibility Segregation)

Separação entre operações de **escrita** (Commands) e **leitura** (Queries):

```
Commands → alteram estado → retornam Result<T>
Queries  → apenas lêem  → retornam Result<T> com dados
```

Cada Command/Query é uma classe record imutável com um Handler correspondente. Isso garante que cada use case seja testável isoladamente.

### Mediator (MediatR)

Os controllers não conhecem os handlers diretamente. Enviam uma mensagem ao `IMediator`, que resolve o handler correto via DI:

```csharp
// Controller: só conhece o Command e o IMediator
var result = await _mediator.Send(new LoginCommand(email, password));

// Handler: só conhece suas dependências injetadas
public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthResponseDto>> { }
```

Benefício: adicionar um novo use case não exige alterar o controller.

### Repository Pattern

Interfaces de repositório no Domain criam uma abstração sobre o mecanismo de persistência. O Application trabalha com `ITransactionRepository` sem saber se é PostgreSQL, MongoDB ou memória:

```csharp
// Application (não sabe o que está por baixo)
await _transactionRepository.AddAsync(transaction, cancellationToken);

// Infrastructure (implementação concreta com EF Core)
public async Task AddAsync(Transaction transaction, CancellationToken ct)
{
    _context.Transactions.Add(transaction);
    await _context.SaveChangesAsync(ct);
}
```

### Result Pattern

Elimina o uso de exceptions para fluxos de controle esperados (usuário não encontrado, email duplicado, etc.). Exceções são reservadas para erros **verdadeiramente inesperados**:

```csharp
// Errado: usa exception para fluxo esperado
if (user == null) throw new NotFoundException("Usuário não encontrado");

// Certo: retorna Result com código de status semântico
if (user == null) return Result<UserDto>.NotFound("Usuário não encontrado.");
```

### Pipeline Behaviors

Comportamentos transversais (cross-cutting concerns) aplicados automaticamente a todos os handlers via pipeline do MediatR:

```
Request → [LoggingBehavior] → [ValidationBehavior] → Handler
```

Adicionar um novo comportamento (cache, retry, autorização) requer apenas criar uma nova classe `IPipelineBehavior<,>` e registrá-la — zero alteração nos handlers existentes.

### Soft Delete

Registros nunca são removidos fisicamente do banco. A flag `IsDeleted = true` os marca como excluídos. O Global Query Filter do EF Core filtra automaticamente esses registros em todas as queries, tornando a exclusão lógica **transparente** para o código de negócio.

---

## 5. Modelo de Dados

### Diagrama de Entidades

```
ApplicationUser (Identity)
│  Id (string/Guid)
│  Name, Email, UserName
│  PreferredCurrency = "BRL"
│  CreatedAt
│
├──< RefreshToken
│     Token (hash SHA256)
│     ExpiresAt, IsRevoked
│
├──< Transaction
│     UserId, Description
│     AmountInCents (long/bigint)
│     Type (Income/Expense)
│     Date (UTC), Notes?
│     IsRecurring, IsDeleted
│     ├── CategoryId (FK, nullable)
│     └── RecurringTransactionId (FK, nullable)
│
├──< Category
│     UserId? (null = padrão do sistema)
│     Name, Color (#hex), Icon (Lucide)
│     IsDefault, IsDeleted
│
├──< RecurringTransaction
│     UserId, Description
│     AmountInCents, Type
│     Frequency (Weekly/Monthly/Yearly)
│     ExecutionDay (1-28)
│     StartDate, EndDate?
│     IsActive, LastExecutedAt?
│     └── CategoryId (FK)
│
└──< FinScoreHistory
      Score (0-100), ReferenceMonth, ReferenceYear
      Breakdown (jsonb): { spendingRatio, regularity, ... }
      CalculatedAt
```

### Convenções do Banco

| Convenção | Detalhe |
|---|---|
| Tabelas | snake_case (transactions, categories, refresh_tokens) |
| Valores monetários | `bigint` em centavos — nunca `decimal` no banco |
| Datas | `timestamp` UTC — timezone apenas no frontend |
| Soft delete | Coluna `is_deleted boolean DEFAULT false` |
| Audit | `created_at`, `updated_at` preenchidos pelo interceptor |
| JSON | `breakdown` em `FinScoreHistory` armazenado como `jsonb` |

### Índices

```sql
-- Transaction: consultas por usuário + período (query mais comum do dashboard)
CREATE INDEX idx_transactions_userid_date ON transactions(user_id, date);

-- RefreshToken: validação rápida por hash
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

---

## 6. Autenticação e Segurança

### Fluxo Completo de Autenticação

```
[POST /api/auth/register ou /login]
  │
  ├─ Validação FluentValidation (via Pipeline Behavior)
  ├─ IdentityService.ValidateCredentials / Register
  ├─ TokenService.GenerateAccessToken()  → JWT 15min
  ├─ TokenService.GenerateRefreshToken() → 64 bytes aleatórios (texto plano)
  ├─ TokenService.HashToken()            → SHA256 do refresh token
  ├─ RefreshTokenRepository.SaveAsync()  → SALVA O HASH (nunca o texto plano)
  │
  └─ AuthController
       ├─ Body JSON: { accessToken, expiresAt, user }
       └─ Cookie httpOnly: refreshToken = TOKEN_TEXTO_PLANO
              Secure: true, SameSite: Strict, MaxAge: 7 dias

[POST /api/auth/refresh]
  │
  ├─ Lê cookie httpOnly refreshToken
  ├─ TokenService.HashToken(rawToken)
  ├─ RefreshTokenRepository.ValidateAsync(hash) → verifica !IsRevoked && ExpiresAt > now
  ├─ RefreshTokenRepository.RevokeAsync(oldHash) ← Rotação: invalida o token antigo
  ├─ Gera novos AccessToken + RefreshToken
  └─ Seta novo cookie com o novo RefreshToken

[POST /api/auth/logout]
  │
  ├─ Lê cookie, hasheia e revoga no banco
  └─ Response.Cookies.Delete("refreshToken")
```

### Por que hash do Refresh Token?

Se o banco de dados for comprometido, o atacante encontrará apenas hashes SHA256. Sem o token original (que está apenas no browser do usuário), os hashes são inúteis para autenticação.

### Rotação de Refresh Token

A cada `/refresh`, o token antigo é **revogado** e um novo é emitido. Se o mesmo token for usado duas vezes (possível sinal de roubo), a segunda tentativa falhará.

### Medidas de Segurança Implementadas

| Ameaça | Contra-medida |
|---|---|
| Força bruta no login | Rate limiting: 5 req/min por IP |
| Muitas tentativas de senha | Identity Lockout: bloqueio após 5 falhas por 15 minutos |
| XSS roubando refresh token | Cookie httpOnly: JavaScript não consegue acessar |
| CSRF | SameSite=Strict: cookie não é enviado em requisições cross-site |
| Injeção SQL | EF Core: queries sempre parametrizadas |
| Segredos no código | Variáveis de ambiente: JWT Secret nunca em appsettings.json |
| Acesso a dados de outros usuários | Global Query Filter por UserId (Fase 2) |
| Exceções expostas em produção | ExceptionMiddleware: detalhes ocultados em produção |

---

## 7. API Endpoints

### Dashboard (`/api/dashboard`)

| Método | Rota | Auth | Query Params | Descrição |
|---|---|---|---|---|
| GET | `/api/dashboard/summary` | JWT | `startDate`, `endDate` | Receitas, despesas, saldo e taxa de poupança |
| GET | `/api/dashboard/expenses-by-category` | JWT | `startDate`, `endDate` | Gastos agrupados por categoria com percentual |
| GET | `/api/dashboard/trend` | JWT | `months` (1–24, default 6) | Tendência mensal de receitas vs despesas |

### Autenticação (`/api/auth`)

| Método | Rota | Auth | Body | Resposta |
|---|---|---|---|---|
| POST | `/api/auth/register` | — | `{ name, email, password }` | 201: `{ accessToken, expiresAt, user }` + cookie |
| POST | `/api/auth/login` | — | `{ email, password }` | 200: `{ accessToken, expiresAt, user }` + cookie |
| POST | `/api/auth/refresh` | Cookie | — | 200: `{ accessToken, expiresAt, user }` + cookie |
| POST | `/api/auth/logout` | JWT | — | 204: No Content |

### Transações (`/api/transactions`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/transactions` | JWT | Listagem paginada com filtros e resumo |
| GET | `/api/transactions/{id}` | JWT | Detalhe por ID |
| POST | `/api/transactions` | JWT | Criar transação |
| PUT | `/api/transactions/{id}` | JWT | Atualizar transação |
| DELETE | `/api/transactions/{id}` | JWT | Soft delete |

Query params: `startDate`, `endDate`, `categoryId`, `type` (1=Receita, 2=Despesa), `page`, `pageSize`

Resposta do `GET /api/transactions`:
```json
{
  "items": [...],
  "page": 1, "pageSize": 20, "totalCount": 42, "totalPages": 3,
  "hasPreviousPage": false, "hasNextPage": true,
  "summary": { "totalIncomeInCents": 800000, "totalExpenseInCents": 210000, "balanceInCents": 590000 }
}
```

### Categorias (`/api/categories`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/categories` | JWT | Lista categorias do sistema + do usuário |
| POST | `/api/categories` | JWT | Criar categoria personalizada |
| PUT | `/api/categories/{id}` | JWT | Atualizar categoria própria |
| DELETE | `/api/categories/{id}` | JWT | Soft delete (rejeita se há transações vinculadas) |

### Formato de Erro Padrão

Todos os erros seguem o padrão ProblemDetails (RFC 7807):

```json
// Erro de validação (400)
{ "error": "O e-mail é obrigatório. | A senha deve ter ao menos 8 caracteres." }

// Erro de negócio (409)
{ "error": "Já existe um usuário cadastrado com este e-mail." }

// Erro interno (500) — apenas em produção
{
  "status": 500,
  "title": "Erro interno do servidor.",
  "detail": "Ocorreu um erro inesperado. Tente novamente."
}
```

---

## 8. Frontend — Arquitetura React

### Fluxo de Estado e Serviços

```
Componente (página/feature)
  └── useAuth (hook customizado)
        ├── authService.ts (chamadas HTTP)
        │     └── api.ts (instância Axios com interceptors)
        │           ├── Interceptor Request: injeta Bearer token do authStore
        │           └── Interceptor Response 401: chama /refresh automaticamente
        └── authStore (Zustand)
              ├── user, accessToken (sessionStorage)
              └── setAuth(), clearAuth(), isAuthenticated()
```

### Por que Zustand?

- **Sem boilerplate:** Não requer Provider, Reducer, Action Creator
- **Performático:** Componentes re-renderizam apenas quando o slice que consomem muda
- **persist middleware:** Integração trivial com sessionStorage/localStorage

```typescript
// Uso em qualquer componente — sem context, sem prop drilling
const { user, accessToken } = useAuthStore();

// Fora de componentes (interceptor Axios)
const token = useAuthStore.getState().accessToken;
```

### Axios Interceptor — Auto-Refresh

O interceptor de resposta gerencia silenciosamente o refresh do token, sem que páginas ou hooks precisem se preocupar:

```
Requisição qualquer → 401 Unauthorized
  ├── !isRefreshing → chama /api/auth/refresh
  │     ├── Sucesso: salva novo token no store, repete a requisição original
  │     └── Falha: limpa store, redireciona para /login
  └── isRefreshing → aguarda o refresh completar, então repete a requisição
        (evita múltiplos refreshes simultâneos com fila de subscribers)
```

### Rotas e Proteção

```typescript
// Rota protegida: redireciona para /login se não autenticado
<ProtectedRoute /> → verifica authStore.isAuthenticated()

// Rota pública: redireciona para /dashboard se autenticado
<PublicRoute /> → evita que usuário logado acesse /login novamente
```

Todas as páginas são carregadas com **lazy loading** (`React.lazy`) para reduzir o bundle inicial.

### Validação de Formulários

React Hook Form com resolução Zod:

```typescript
// Schema Zod define as regras (mesmo as regras do backend, validadas no cliente)
const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

// useForm usa o schema automaticamente — sem estado manual de erros
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});
```

Vantagem: validação client-side instantânea com as mesmas regras do backend (ambos validam email, tamanho da senha, etc.).

---

## 9. Design System

### Tokens de Cor (CSS Variables)

Definidos em `src/index.css` com suporte a dark/light mode via classe `dark` no elemento `<html>`:

```css
/* Modo claro (padrão) */
:root {
  --color-background:    #FFFFFF;
  --color-surface:       #F8FAFC;
  --color-primary:       #3B82F6;
  --color-text-primary:  #0F172A;
  --color-text-secondary:#64748B;
  --color-success:       #059669;
  --color-danger:        #DC2626;
  --color-warning:       #D97706;
  --color-border:        #E2E8F0;
}

/* Modo escuro — aplicado quando <html class="dark"> */
.dark {
  --color-background:    #0F172A;
  --color-surface:       #1E293B;
  --color-primary:       #60A5FA;
  /* ... */
}
```

O `uiStore` (Zustand) persiste a preferência no `localStorage`. O `ThemeProvider` (em `providers.tsx`) aplica/remove a classe `dark` no `document.documentElement` quando o tema muda.

### Animações (Framer Motion)

| Padrão | Configuração |
|---|---|
| Page transitions | `{ opacity: 0→1, y: 10→0, duration: 0.3 }` |
| Mensagens de erro | `{ opacity: 0→1, y: -4→0, duration: 0.2 }` |
| Layout de auth | Formulário e branding com delays escalonados |
| Modais (Fase 2+) | Scale 0.95→1 com backdrop blur |
| Gráficos (Fase 3+) | Staggered entry por elemento |
| Cards (Fase 2+) | Scale 1.02 no hover com spring |

### Componentes Base

**Button:** Variantes `primary`, `secondary`, `ghost`, `danger`. Tamanhos `sm`, `md`, `lg`. Prop `loading` exibe spinner e desabilita o botão automaticamente.

**Input:** Com suporte a `label`, `error` (borda vermelha + mensagem), `leftIcon` e `rightIcon`. Integração direta com `react-hook-form` via `forwardRef`.

**Card:** Container com `background-color: surface`, `border`, `border-radius: lg`, `box-shadow: sm`. Padding configurável.

---

## 10. Configuração de Ambiente

### Variáveis de Ambiente — Backend

| Variável | Exemplo | Obrigatório |
|---|---|---|
| `ConnectionStrings__DefaultConnection` | `Host=localhost;Database=fintrack_dev;Username=postgres;Password=postgres` | Sim |
| `JwtSettings__Secret` | Mínimo 32 caracteres | Sim |
| `JwtSettings__Issuer` | `FinTrack` | Sim |
| `JwtSettings__Audience` | `FinTrack.Users` | Sim |
| `AllowedOrigins__Frontend` | `http://localhost:5173` | Não (default) |

> **Em desenvolvimento:** as variáveis podem ser definidas em `appsettings.Development.json`.
> **Em produção:** **nunca** usar arquivos de configuração para segredos. Usar variáveis de ambiente do sistema operacional, Docker secrets ou serviço de secrets do provedor de cloud.

### Variáveis de Ambiente — Frontend

Criar arquivo `fintrack-web/.env.local` (não commitado no git):

```env
VITE_API_URL=http://localhost:5000
```

---

## 11. Execução Local

### Pré-requisitos

- .NET 8 SDK
- Node.js 20+
- PostgreSQL 15+ (local ou Docker)
- EF Core CLI: `dotnet tool install --global dotnet-ef`

### Backend

```bash
# 1. Clonar e entrar no projeto
cd "FinTrack"

# 2. Configurar variáveis de ambiente (ou editar appsettings.Development.json)
export ConnectionStrings__DefaultConnection="Host=localhost;Database=fintrack_dev;Username=postgres;Password=postgres"
export JwtSettings__Secret="dev-secret-key-change-in-production-must-be-32-chars"
export JwtSettings__Issuer="FinTrack"
export JwtSettings__Audience="FinTrack.Users"

# 3. Criar e aplicar migrations
dotnet ef migrations add InitialCreate \
  --project src/FinTrack.Infrastructure \
  --startup-project src/FinTrack.API

dotnet ef database update \
  --project src/FinTrack.Infrastructure \
  --startup-project src/FinTrack.API

# 4. Executar
dotnet run --project src/FinTrack.API

# Swagger disponível em: https://localhost:{porta}/swagger
```

### Frontend

```bash
cd fintrack-web

# Criar arquivo de ambiente local
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Acesse: http://localhost:5173
```

### Build de Produção

```bash
# Backend
dotnet publish src/FinTrack.API -c Release -o publish/

# Frontend
cd fintrack-web && npm run build
# Artefatos em fintrack-web/dist/
```

---

## 12. Roadmap de Fases

### Fase 1 — Fundação (Concluída)
- [x] Estrutura monorepo + solução .NET com 4 projetos + 3 projetos de teste
- [x] Domain: entidades, value objects, enums, interfaces de repositório
- [x] Application: Result\<T\>, Pipeline Behaviors, Auth Commands/Validators
- [x] Infrastructure: DbContext, Identity, JWT, Refresh Token, AuditInterceptor, Seed
- [x] API: AuthController, ExceptionMiddleware, CORS, Rate Limiting, Swagger
- [x] Frontend: Vite + React 18 + Tailwind v4 + design system
- [x] Autenticação completa com refresh token rotation
- [x] Telas de Login e Registro com validação e animações
- [x] CLAUDE.md e .gitignore

### Fase 2 — CRUD Core (Concluída)
- [x] `CategoryRepository` e `TransactionRepository` concretos no Infrastructure
- [x] Commands: `CreateTransaction`, `UpdateTransaction`, `DeleteTransaction`, `CreateCategory`, `UpdateCategory`, `DeleteCategory`
- [x] Queries: `GetTransactions` (paginada com filtros por data, categoria e tipo), `GetTransactionById`, `GetCategories`
- [x] DTOs: `TransactionDto`, `PagedTransactionsDto` com `TransactionSummaryDto` (receitas/despesas/saldo)
- [x] Endpoints `GET /api/transactions` com paginação, filtros e resumo financeiro
- [x] Endpoints CRUD `/api/categories`
- [x] `transactionStore` (Zustand) com fetch, create, update, delete e paginação
- [x] `TransactionsPage` com resumo financeiro, lista e painel lateral de criação/edição
- [x] `TransactionForm` com React Hook Form + Zod
- [x] Dashboard com sidebar de navegação

### Fase 3 — Dashboard e Visualizações (Concluída)
- [x] Queries de agregação: `GetDashboardSummaryQuery`, `GetExpensesByCategoryQuery`, `GetRevenueVsExpenseTrendQuery`
- [x] Endpoints `/api/dashboard/summary`, `/api/dashboard/expenses-by-category`, `/api/dashboard/trend`
- [x] Wrappers de gráficos Recharts: `AreaTrendChart` (receitas vs despesas), `DonutCategoryChart` (gastos por categoria)
- [x] Cards animados com CountUp via `requestAnimationFrame` (sem dependência externa)
- [x] Seletor temporal com atalhos: Este mês, 3 meses, 6 meses, Este ano
- [x] 4 cards de resumo: Receitas, Despesas, Saldo, Taxa de poupança

### Fase 4 — Inteligência Financeira
- [ ] `FinScoreCalculator` com 5 indicadores ponderados
- [ ] `ProjectionEngine` com média ponderada dos últimos 3 meses
- [ ] Detecção de anomalias (gasto > 1.5x desvio padrão)
- [ ] Background Service para lançamento automático de recorrências
- [ ] Tela Analytics: gauge do FinScore, projeções, alertas por severidade
- [ ] Tela Recorrências com toggle e preview da próxima execução

### Fase 5 — Polish e Deploy
- [ ] Testes unitários (Domain + Application handlers)
- [ ] GitHub Actions: CI (build + testes) + CD (Render + Vercel)
- [ ] Neon (PostgreSQL cloud) em produção
- [ ] Performance review: índices, query optimization, N+1 check
- [ ] README profissional com screenshots e GIFs

---

*Documentação gerada em Março 2026. Atualizar conforme o projeto evolui.*

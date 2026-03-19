# CLAUDE.md - FinTrack Development Guide

## PROJETO
FinTrack - Sistema de controle financeiro pessoal.
Stack: .NET 8 (Clean Architecture) + React 18 + TypeScript + Tailwind CSS + PostgreSQL.

## CONTEXTO DO DESENVOLVEDOR
Nivel intermediario/avancado em .NET, iniciante em React.
Quando gerar codigo React, SEMPRE explique brevemente o que cada hook,
pattern ou decisao faz e por que. No .NET, pode ser mais direto.
Este projeto e tambem uma ferramenta de aprendizado guiado.

## IDIOMA
Comentarios, commits e mensagens de erro em PORTUGUES.
Codigo (nomes de variaveis, funcoes, classes) em INGLES.

## ARQUITETURA BACKEND - CLEAN ARCHITECTURE
4 camadas com dependencia de fora para dentro:

### FinTrack.Domain (ZERO dependencias externas)
- Entidades: BaseEntity (Id Guid, CreatedAt, UpdatedAt), AuditableEntity (+CreatedBy)
- Transaction, Category, RecurringTransaction, FinScoreHistory
- Value Objects: Money (AmountInCents long + Currency string)
- Enums: TransactionType (Income, Expense), RecurrenceFrequency (Monthly, Weekly, Yearly)
- Interfaces de repositorio: ITransactionRepository, ICategoryRepository, etc.
- Regras de negocio PURAS nas entidades

### FinTrack.Application (depende so do Domain)
- Pacotes: MediatR, FluentValidation, FluentValidation.DependencyInjectionExtensions
- Estrutura: Features/{Feature}/Commands/, Queries/, Validators/, DTOs/
- Cada use case = 1 Request (IRequest<Result<T>>) + 1 Handler
- Result<T> pattern: NUNCA exceptions para fluxo de controle
- 1 classe FluentValidation por Command/Query
- Pipeline Behaviors: ValidationBehavior + LoggingBehavior
- Mappings manuais via extension methods (sem AutoMapper)
- Interfaces de servico: ITokenService, IIdentityService, IRefreshTokenRepository

### FinTrack.Infrastructure
- Pacotes: Npgsql.EntityFrameworkCore.PostgreSQL, Identity.EntityFrameworkCore, Serilog
- AppDbContext com IEntityTypeConfiguration<T> por entidade
- Global Query Filters: !IsDeleted + UserId == currentUser (implementar nas Fases 2+)
- ApplicationUser herda IdentityUser (Name, CreatedAt, PreferredCurrency)
- TokenService: JWT 15min + refresh 7d (hash SHA256 do token no banco)
- IdentityService: abstrai UserManager/SignInManager para o Application
- RefreshTokenRepository: salva/valida/revoga refresh tokens hasheados
- SaveChangesInterceptor para audit (CreatedAt/UpdatedAt)

### FinTrack.API
- Controllers THIN: request -> MediatR -> response
- ExceptionMiddleware -> ProblemDetails (RFC 7807)
- CORS, Rate Limiting (5/min login), Swagger com JWT Bearer
- Refresh token: httpOnly cookie (nunca retornado no body JSON)

## PADROES BACKEND
- PascalCase. Interfaces com I. 1 classe por arquivo.
- Max ~150 linhas/classe, ~30 linhas/metodo.
- Async/await em TODO I/O. Suffix Async.
- Valores monetarios em centavos (long). Conversao so no frontend.
- Datas UTC no banco. Timezone no frontend.
- DI via construtor. Nunca service locator.
- Sem regions. Comentarios so para 'por que'.
- Secrets via Environment Variables. NUNCA appsettings.json.

## FRONTEND - REACT + TYPESCRIPT + TAILWIND

### Estrutura
- pages/ (1 por rota), components/ui/ (design system), components/layout/,
  components/charts/ (Recharts wrappers), components/features/,
  hooks/, services/ (Axios), stores/ (Zustand), types/, utils/
- Alias @ aponta para src/

### Padroes
- TypeScript STRICT. Nunca 'any'.
- Function components com arrow functions.
- Props via interface {Component}Props.
- Framer Motion para TODAS animacoes.
- React Hook Form + Zod para forms.
- Zustand para global state (authStore, uiStore).
- Loading + error + empty states em TODAS as telas.

### Design (CRITICO)
- ZERO emojis. Font: Inter. Dark/light mode via classe 'dark' no html.
- Paleta: CSS variables em index.css (--color-background, --color-surface, etc.)
- Espacamento generoso. Animacoes sutis (0.2-0.3s).
- rounded-lg padrao. shadow-sm padrao.
- Icones: Lucide React, 20px padrao.

### Servicos
- api.ts: instancia Axios com interceptors (injecao de token + auto-refresh em 401)
- withCredentials: true em toda instancia (necessario para cookies)
- VITE_API_URL via .env.local

## BANCO DE DADOS
- PostgreSQL (Neon free tier em prod, local em dev). EF Core code-first migrations.
- Indexes: UserId em todas tabelas. Composite (UserId, Date) em Transaction.
- Money como bigint (centavos). Currency varchar(3) default 'BRL'.
- FinScoreHistory.Breakdown: jsonb.
- Seed: categorias padrao no CategoryConfiguration.HasData().

## SEGURANCA
- Secrets via Environment Variables. NUNCA appsettings.json.
- Identity para passwords (PBKDF2). CORS apenas frontend.
- Rate limiting: 5/min no login. [Authorize] em tudo exceto auth.
- Refresh token: hash SHA256 no banco, token bruto via httpOnly cookie.
- FluentValidation em todo Command/Query via Pipeline Behavior.

## WORKFLOW
- Feature flow: Domain -> Application -> Infrastructure -> API -> Frontend.
- Testar via Swagger antes de integrar frontend.
- Commits: feat:, fix:, refactor:, docs:, test: (em portugues)
- Cada Command/Query DEVE ter Validator.
- Cada endpoint DEVE retornar HTTP correto (200,201,204,400,401,404).
- Responsivo: mobile 375px + desktop.

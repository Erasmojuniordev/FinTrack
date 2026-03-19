# FinTrack 💰

Sistema de controle financeiro pessoal desenvolvido com **.NET 8** (Clean Architecture) e **React 18** (TypeScript). Permite gerenciar receitas, despesas, categorias e transações recorrentes, com autenticação segura via JWT.

> Projeto em desenvolvimento ativo — Fase 1 (autenticação) concluída.

---

## Funcionalidades

- **Autenticação completa** — registro, login, refresh token com rotação, logout
- **Gestão de transações** — receitas e despesas com categorização *(Fase 2)*
- **Categorias personalizadas** — sistema + categorias do usuário *(Fase 2)*
- **Dashboard financeiro** — resumo mensal, gráficos e saldo *(Fase 3)*
- **FinScore** — pontuação de saúde financeira 0–100 *(Fase 4)*
- **Transações recorrentes** — geração automática de lançamentos *(Fase 4)*

---

## Stack

### Backend
| Tecnologia | Uso |
|---|---|
| .NET 8 / ASP.NET Core | Framework principal |
| Entity Framework Core 8 | ORM (code-first) |
| PostgreSQL + Npgsql | Banco de dados |
| ASP.NET Core Identity | Gerenciamento de usuários |
| MediatR | CQRS / Mediator pattern |
| FluentValidation | Validação de comandos |
| Serilog | Logs estruturados |
| Swashbuckle 6.9 | Documentação Swagger |

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | Framework UI |
| Vite | Build tool |
| Tailwind CSS v4 | Estilização |
| Framer Motion | Animações |
| Zustand | Estado global |
| Axios | HTTP client |
| React Hook Form + Zod | Formulários e validação |
| React Router v6 | Roteamento |
| Recharts | Gráficos *(Fase 3)* |

---

## Arquitetura

O backend segue **Clean Architecture** com 4 camadas. As dependências fluem de fora para dentro — apenas a camada mais interna (Domain) não depende de nenhuma outra.

```
FinTrack/
├── src/
│   ├── FinTrack.Domain/          # Entidades, interfaces, enums, value objects
│   ├── FinTrack.Application/     # Use cases (CQRS), DTOs, validators, behaviors
│   ├── FinTrack.Infrastructure/  # EF Core, Identity, JWT, repositórios
│   └── FinTrack.API/             # Controllers, middlewares, Program.cs
├── tests/
│   ├── FinTrack.Domain.Tests/
│   ├── FinTrack.Application.Tests/
│   └── FinTrack.API.Tests/
├── fintrack-web/                 # Frontend React
└── docs/
    └── TECHNICAL.md              # Documentação técnica detalhada
```

### Padrões implementados
- **CQRS com MediatR** — Commands e Queries como objetos separados
- **Result\<T\> pattern** — sem exceções para controle de fluxo previsível
- **Pipeline Behaviors** — validação e logging automáticos antes de cada handler
- **Repository pattern** — interfaces no Domain, implementações na Infrastructure
- **Soft delete** — flag `IsDeleted` + EF Core Global Query Filters
- **Audit trail** — `SaveChangesInterceptor` preenche `CreatedAt`/`UpdatedAt`

---

## Segurança

- **JWT HS256** — access token com TTL de 15 minutos
- **Refresh token com rotação** — token de 7 dias, revogado a cada uso
- **Hash SHA256** — apenas o hash é armazenado no banco; token bruto via httpOnly cookie
- **Rate limiting** — 5 requisições/minuto no endpoint de login
- **CORS restrito** — apenas `http://localhost:5173` em desenvolvimento

---

## Executando localmente

### Pré-requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/)

### Backend

**1. Configure as variáveis de ambiente:**
```bash
# Windows (PowerShell)
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Database=fintrack_dev;Username=postgres;Password=sua_senha"
$env:JwtSettings__Secret = "sua-chave-secreta-com-pelo-menos-32-caracteres"
$env:JwtSettings__Issuer = "FinTrack"
$env:JwtSettings__Audience = "FinTrack-Users"

# Linux / macOS
export ConnectionStrings__DefaultConnection="Host=localhost;Database=fintrack_dev;Username=postgres;Password=sua_senha"
export JwtSettings__Secret="sua-chave-secreta-com-pelo-menos-32-caracteres"
export JwtSettings__Issuer="FinTrack"
export JwtSettings__Audience="FinTrack-Users"
```

**2. Aplique as migrations e inicie a API:**
```bash
# Aplicar migrations
dotnet ef database update \
  --project src/FinTrack.Infrastructure \
  --startup-project src/FinTrack.API

# Iniciar a API
dotnet run --project src/FinTrack.API
```

**3. Acesse o Swagger:** `https://localhost:{porta}/swagger`

### Frontend

```bash
cd fintrack-web

# Crie o arquivo de ambiente
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Instale as dependências e inicie
npm install
npm run dev
```

Acesse `http://localhost:5173`

---

## API — Endpoints de autenticação

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Cadastro de novo usuário | — |
| `POST` | `/api/auth/login` | Login (retorna JWT + cookie) | — |
| `POST` | `/api/auth/refresh` | Renova access token via cookie | — |
| `POST` | `/api/auth/logout` | Revoga refresh token | Bearer |

> Os demais endpoints (transações, categorias, dashboard) serão adicionados nas próximas fases.

---

## Roadmap

- [x] **Fase 1** — Autenticação JWT completa + telas de Login/Registro
- [ ] **Fase 2** — CRUD de Transações e Categorias
- [ ] **Fase 3** — Dashboard com gráficos e resumo mensal
- [ ] **Fase 4** — FinScore + Projeções + Transações Recorrentes
- [ ] **Fase 5** — Testes automatizados + CI/CD + Deploy (Fly.io + Neon + Vercel)

---

## Documentação

A documentação técnica detalhada está em [docs/TECHNICAL.md](docs/TECHNICAL.md). Ela cobre:

- Diagrama de arquitetura e fluxo de dependências
- Modelo de dados (ERD) com todas as entidades
- Fluxo de autenticação passo a passo
- Arquitetura do frontend (estado, roteamento, interceptors)
- Design system (tokens CSS, animações, componentes)
- Guia de configuração de ambiente

---

## Contribuindo

Este é um projeto pessoal de portfólio. Issues e sugestões são bem-vindos.

---

## Licença

MIT

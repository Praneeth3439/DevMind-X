# DevMind X

DevMind X is an autonomous software-engineering intelligence platform for repository analysis, defect investigation, evidence-based repair, test execution, and validated pull-request proposals.

This repository is currently in the **initial architecture and scaffolding phase**. The first implementation phase will begin only after the architecture and roadmap are approved.

## Architecture overview

DevMind X uses a modular monorepo with a React dashboard, a FastAPI API, asynchronous workflow orchestration, repository intelligence services, isolated execution, and PostgreSQL-backed persistence.

```text
React dashboard
       |
       v
FastAPI REST API ---- PostgreSQL
       |
       +---- LangGraph orchestration
       |          |
       |          +---- repository intelligence
       |          +---- diagnosis and repair
       |          +---- validation and reporting
       |
       +---- GitHub integration
       +---- ChromaDB retrieval
       +---- Docker execution workers
```

Important boundaries:

- The API handles authentication, authorization, request validation, and job lifecycle APIs.
- Workers execute long-running analysis and validation workflows outside request handlers.
- Repository analysis produces durable evidence artifacts rather than relying on an LLM-only answer.
- Proposed code changes are isolated, tested, and presented for approval before pull-request creation.
- Provider credentials and runtime configuration are supplied through environment variables; no provider or key is hardcoded.

See [docs/architecture.md](docs/architecture.md) for component responsibilities, data flow, security boundaries, and deployment assumptions.

## Technology stack

### Frontend

- React, Vite, TypeScript
- Tailwind CSS and shadcn/ui
- React Router, Axios, Lucide React, Recharts

### Backend and AI

- Python 3.12+
- FastAPI, Pydantic, SQLAlchemy, Alembic
- LangGraph with LangChain where useful
- Configurable LLM provider interface
- Tree-sitter, Python AST, Semgrep, Radon, Ruff
- ChromaDB for code retrieval and embeddings

### Persistence, execution, and delivery

- PostgreSQL
- Docker and Docker Compose
- Pytest and Vitest
- GitHub Actions
- AWS-ready container deployment

## Planned folder structure

```text
.
├── backend/
│   ├── app/
│   │   ├── api/              # REST routers and request/response schemas
│   │   ├── core/             # settings, security, logging
│   │   ├── db/               # SQLAlchemy models, sessions, repositories
│   │   ├── domains/           # application use cases and domain services
│   │   ├── integrations/      # GitHub, LLM, embeddings, vector store
│   │   ├── workers/           # background workflow entry points
│   │   └── main.py
│   ├── migrations/            # Alembic migrations
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── app/               # routing and application composition
│   │   ├── components/        # shared UI components
│   │   ├── features/          # feature-oriented screens and state
│   │   ├── lib/               # API client and utilities
│   │   └── types/
│   └── tests/
├── cli/                       # developer-facing command-line interface
├── docs/                      # architecture, API, database, security, deployment
├── infra/                     # Docker Compose, CI/CD, and AWS deployment assets
├── scripts/                   # local development and maintenance scripts
└── DEVELOPMENT_STATUS.md
```

## Development phases

1. **Foundation** — repository structure, configuration, CI, database base, health endpoints, and frontend shell.
2. **Identity and GitHub integration** — secure authentication, repository connection, permissions, and webhook/job lifecycle.
3. **Repository intelligence** — file inventory, language detection, parsing, dependency mapping, metrics, and indexed retrieval.
4. **Agent orchestration** — LangGraph workflows with explicit state, evidence collection, bounded tools, and durable run events.
5. **Diagnosis and repair** — defect localization, root-cause reports, patch generation, diff review, and approval gates.
6. **Validation** — isolated Docker test execution, generated tests, result collection, repair retry limits, and behavioral verification.
7. **Quality and delivery** — security analysis, quality reports, pull-request proposals, CLI, observability, and deployment hardening.

The detailed roadmap and acceptance gates are in [docs/roadmap.md](docs/roadmap.md).

## Initial setup

1. Install Python 3.12 or newer and make it the selected interpreter.
2. Install Git and restart the terminal so it is available on PATH.
3. Install Node.js and Docker Desktop.
4. Copy `.env.example` to `.env` and set local values.
5. Create a Python 3.12+ virtual environment and install backend dependencies:

   ```powershell
   py -3.12 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install -e ".\backend[test]"
   ```

6. Install frontend dependencies:

   ```powershell
   Set-Location frontend
   npm install
   ```

7. Start local infrastructure:

   ```powershell
   docker compose up -d postgres
   ```

8. Run the initial checks:

   ```powershell
   Set-Location backend
   pytest
   Set-Location ..\frontend
   npm test
   npm run typecheck
   npm run build
   ```

If dependency post-install scripts are blocked by local Windows application policy,
run `npm install --ignore-scripts` and use a non-OneDrive checkout or CI to execute
Vite tests and builds. Do not treat a skipped native-binary check as a successful
frontend build.

## Configuration

Configuration is documented in [.env.example](.env.example). Secrets must remain in local environment configuration or a managed secret store and must never be committed.

## Current status

See [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md). No application feature is marked complete until it has been implemented and verified by tests.

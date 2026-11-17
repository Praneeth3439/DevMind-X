# DevMind X Architecture

## Goals

DevMind X must investigate software changes with traceable evidence, keep long-running work out of HTTP request handlers, isolate untrusted repository execution, and require explicit approval before external side effects such as creating a pull request.

## Logical components

| Component | Responsibility |
|---|---|
| Frontend | Repository connections, analysis runs, evidence, diffs, test results, reports, and approvals |
| API | Authentication, authorization, validation, job submission, status, and read APIs |
| Workflow engine | LangGraph state machine for bounded analysis, diagnosis, repair, and validation |
| Repository intelligence | Checkout, inventory, parsing, dependency relationships, metrics, static analysis, and indexing |
| Evidence store | Durable findings, source locations, tool output, hypotheses, patches, and validation results |
| Integration layer | GitHub, configurable LLM/embedding providers, ChromaDB, and Docker |
| Execution worker | Ephemeral, resource-limited test and analysis containers |
| PostgreSQL | Users, repositories, runs, artifacts, permissions, findings, patches, and audit events |
| CLI | Scriptable access to repository analysis and run/report operations |

## Core workflow

1. Authenticate the user and obtain a scoped GitHub authorization.
2. Register a repository and record the selected commit/ref.
3. Create an analysis run and enqueue a workflow job.
4. Build a repository inventory and dependency-aware retrieval index.
5. Collect deterministic tool evidence before asking the LLM to synthesize conclusions.
6. Generate a root-cause hypothesis with source references and confidence.
7. Generate a patch in an isolated worktree.
8. Run targeted and repository tests inside a constrained Docker execution environment.
9. Retry only within a configured attempt limit when validation fails.
10. Persist the final report and present the diff for user approval.
11. Create a GitHub pull request only after approval and a final authorization check.

## Trust boundaries

- Browser to API: authenticated HTTPS requests with CSRF/session or token protections.
- API to GitHub: least-privilege OAuth scopes and encrypted token storage.
- API to worker: authenticated internal job messages and tenant-scoped identifiers.
- Worker to repository code: untrusted input; no host filesystem access, restricted network, resource limits, and timeout enforcement.
- LLM boundary: redact secrets and send only the minimum relevant source/evidence context.
- Pull-request creation: explicit user approval, idempotency protection, and audit logging.

## Persistence principles

- Store immutable run events and tool outputs for auditability.
- Store references to source commit, file path, line/column, and content hash for findings.
- Keep generated patches separate from repository state until approved.
- Use Alembic migrations for schema changes.
- Keep vector indexes rebuildable from canonical repository artifacts.

## Initial implementation constraints

- Provider adapters must expose a common interface and report missing configuration clearly.
- Workflow nodes must be deterministic where a deterministic tool is available.
- API handlers must not perform unbounded repository analysis synchronously.
- All external side effects must be explicit, authorized, and observable.


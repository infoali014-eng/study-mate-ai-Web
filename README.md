# Mr Owl AI

Learn Smarter. Revise Faster. Prepare Better.

An AI-powered Study Platform designed for production-grade scale.

## Repository Structure

This repository is structured as a monorepo containing two completely independent applications:

*   **`frontend/`**: The user interface built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn UI, and Zustand.
*   **`backend/`**: The FastAPI-based REST API built with Python 3.12+, Pydantic, and managed by `uv`.

## Architecture & Layout

Both applications adhere strictly to Clean Architecture guidelines to ensure scalability and maintainability:

*   **Frontend**:
    *   `app/`: Next.js routing and layout configuration.
    *   `components/`: Reusable interface components categorized into `ui/`, `common/`, `layout/`, and `feedback/`.
    *   `features/`: Modular domain-specific features.
    *   `shared/`: Shared `constants/`, `types/`, and `utils/` across features.
    *   `lib/`: Core initializations for `api/` (API client), `http/` (Axios configuration), and `supabase/` (auth client).
*   **Backend**:
    *   `app/api/`: Routing, request handlers, and HTTP entrypoints.
    *   `app/domain/`: Domain models, repository interfaces, schemas, and core services.
    *   `app/infrastructure/`: Technical integrations (Supabase, Cloudflare R2, AI providers, logging, caching).
    *   `app/ai/`: Specialized module for prompt engineering, embeddings, RAG, memory, and LLM providers.
    *   `app/jobs/`: Asynchronous background processing (e.g., OCR, email notifications).

## Technology Stack & Deployment

*   **Frontend**: Next.js (Vercel) + CDN (Cloudflare)
*   **Backend**: FastAPI (Railway)
*   **Database**: Supabase PostgreSQL + Auth + Realtime + pgvector (Supabase)
*   **Storage**: Cloudflare R2 (Cloudflare)
*   **CI/CD**: GitHub Actions

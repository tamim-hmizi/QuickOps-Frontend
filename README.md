# QuickOps Frontend

QuickOps Frontend is the web console of QuickOps, a DevOps-as-a-Service platform. Users register a project (one frontend repository and one or more backend repositories), ask the QuickOps AI service for a deployment recommendation, choose a virtual machine or Kubernetes target, trigger the deployment pipeline and follow its build stages.

## Features

- Registration and login, with the session persisted through Redux Toolkit and redux-persist
- Project list with a responsive sidebar layout
- Project creation form: name, frontend repository, backend repositories and GitHub access token
- Project detail page with deployment status (deployed, deploying, not deployed)
- AI analysis: calls the QuickOps AI `/suggest` endpoint and stores the recommendation and reasoning on the project
- Deployment target selection (VM or Kubernetes) and deployment trigger through the backend
- Build status modal showing the Jenkins pipeline stages, the failed stage and the full build log
- Project deletion (blocked for deployed projects) and toast notifications

## Tech stack

React 19, Vite, React Router, Redux Toolkit, redux-persist, Axios, Tailwind CSS 4, daisyUI, react-icons, react-hot-toast, ESLint.

## Architecture

The frontend talks to two services:

- **QuickOps Backend** (`src/services/api.js`, default `http://localhost:5000/api`) for authentication, projects, deployments and logs
- **QuickOps AI** (`src/pages/ProjectDetail.jsx`, port `8001`, `POST /suggest`) for the VM vs Kubernetes recommendation

The backend then drives Jenkins, SonarQube, Nexus, Terraform, Ansible, Prometheus and Grafana, hosted on the platform VM provisioned by QuickOps-IAC and configured by QuickOps-CAC.

## Configuration

Copy `.env.example` to `.env`. Vite reads these at build time:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | QuickOps-Backend API |
| `VITE_AI_URL` | `http://localhost:8001` | QuickOps-AI service |

## Tests

```bash
npm test
```

## Related repositories

| Repository | Role |
|---|---|
| [QuickOps-Frontend](https://github.com/tamim-hmizi/QuickOps-Frontend) | React web console |
| [QuickOps-Backend](https://github.com/tamim-hmizi/QuickOps-Backend) | Express/MongoDB API and deployment orchestrator |
| [QuickOps-AI](https://github.com/tamim-hmizi/QuickOps-AI) | FastAPI + LLM deployment recommender |
| [QuickOps-IAC](https://github.com/tamim-hmizi/QuickOps-IAC) | Terraform for the QuickOps platform VM |
| [QuickOps-CAC](https://github.com/tamim-hmizi/QuickOps-CAC) | Ansible configuration of the DevOps toolchain |

## Getting started

### Prerequisites

- Node.js 20.19+ (or 22.12+) and npm
- A running QuickOps Backend and QuickOps AI service

### Install and run

```bash
npm install
npm run dev        # Vite dev server on http://localhost:5173
```

### Configuration

Service URLs are currently set in code: `baseURL` in `src/services/api.js` (backend) and the `/suggest` URL in `src/pages/ProjectDetail.jsx` (AI service). Update them to match your environment. No environment variables are required.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Deployment

`npm run build` produces a static bundle in `dist/` that can be served by any static web server.

## Project context

RFC final year project, 2025, by Tamim Hmizi: https://tamim-hmizi.github.io/Portfolio/

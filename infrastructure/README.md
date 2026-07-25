# Infrastructure

How the platform runs in environments.

| Path | Purpose |
|------|---------|
| `docker/` | Dockerfiles and Compose for local/dev parity |
| `k8s/` | Kubernetes manifests/Helm charts |
| `terraform/` | Cloud-neutral IaC modules |

No cloud account specifics or secrets belong in git. Use examples and variable interfaces.

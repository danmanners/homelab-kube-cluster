# Node-Feature-Discovery

This is a project from [kubernetes-sigs/node-feature-discovery](https://github.com/kubernetes-sigs/node-feature-discovery).

The modifications/overrides are to replace the official image tag with a slightly different version that allows deployment on `aarch64`/`arm64`.

- Docker images can be found here: [Docker Hub](https://hub.docker.com/r/danielmanners/node-feature-discovery/
- Deployment code can be foud here [GitHub](https://github.com/danmanners/node-feature-discovery/blob/v0.9.0/.github/workflows/build-and-push.yaml)

```bash
kubectl apply -k manifests/workloads/node-feature-discovery
```

## Examples

The `overrides` and `pod.yaml` allow me to pass through a blink(1) device via USB on one of my physical cluster nodes. It's super exciting.

```bash
kubectl apply -f pod.yaml
```

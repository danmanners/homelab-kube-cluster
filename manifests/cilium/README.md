# Cilium CNI

[Cilium](https://cilium.io/) is a CNI (or container network interface) for Kubernetes which is capable of providing networking, security, and observability. It is also what we want to run as our CNI inside of our Kubernetes cluster.

## Generating the Helm Output

```bash
# Generate the Helm Output
helm template cilium cilium/cilium \
  --version ${VERSION:=1.11.1} \
  --namespace kube-system \
  --set hubble.relay.enabled=true \
  --set hubble.ui.enabled=true \
  --values values.yaml > helm-rendered.yaml
```

## Applying the Rendered Helm Template

```bash
# From the root of the Git repo
kubectl apply -k manifests/cilium
```

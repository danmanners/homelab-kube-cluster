# Cilium

```bash
# Generate the Helm Output
helm template cilium cilium/cilium \
  --version ${VERSION:=1.11.1} \
  --namespace kube-system \
  --set hubble.relay.enabled=true \
  --set hubble.ui.enabled=true \
  --values values.yaml > helm-rendered.yaml
```

## Apply

```bash
# From the root of the Git repo
kubectl apply -k manifests/cilium
```

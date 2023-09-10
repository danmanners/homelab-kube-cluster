# Installing Kube-Prometheus-Stack

Steps to install Kube-Prometheus-Stack in the Kubernetes cluster.

Reference the [Kube-Prometheus-Stack Installation instructions](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) for more information.

## Add the repo

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

## Fetch the Values

```bash
helm show values prometheus-community/kube-prometheus-stack \
    --version 30.0.1 > manifests/workloads/kube-prom-stack-grafana/values.yaml
```

## Render the Output

```bash
helm template monitoring \
    --namespace kube-system --version 30.0.1 \
    prometheus-community/kube-prometheus-stack > rendered-helm.yaml
```

## Install the Kube-Prometheus-Stack

```bash
```

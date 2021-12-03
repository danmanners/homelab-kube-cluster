# Setting up DexIDP

This should guide you through the rendering, configuration and installation of the DEX software.

## Fetching the values

We can fetch the helm chart values by running:

```bash
helm show values dex/dex > values.yaml
```

## Rendering the template

```bash
helm template dex --create-namespace \
    --namespace dex --values values.yaml \
    dex/dex --version 0.6.3 > rendered-helm.yaml
```

## Deploying everything

```bash
kustomize build --enable-alpha-plugins | kubectl apply -f -
```

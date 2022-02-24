# Rendering Traefik

We want to ensure that we have full control over the helm files, so lets do this:

## Add the Repo

```bash
helm repo add traefik https://helm.traefik.io/traefik
```

## Fetch the values file

```bash
helm show values traefik/traefik > values-new.yaml
```

Open the new `values-new.yaml` file, make any changes, then we can render the output.

## Render the Traefik output

```bash
helm template traefik traefik/traefik \
    --version 10.14.2 \
    -f values.yaml > traefik-rendered.yaml
```

## Install Traefik to your cluster

```bash
kubectl apply -k manifests/workloads/traefik-helm
```

## Installing/Patching the CRDs

Because Helm does not support updating/managing CRDs, we can leverage the `crds` directory and add all of the URLs for them in the kustomization file.

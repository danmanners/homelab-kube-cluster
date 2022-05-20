# Installing Traefik via Helm and Kustomize

We can install Traefik and the requirements by running the following command:

```bash
kustomize build --enable-helm | kubectl apply -f -
```

## Updating the CRDs

Because Helm does not support updating/managing CRDs, we can leverage the `crds` directory and add all of the URLs for them in the kustomization file. When you roll the helm chart version forward, _make sure to update all of the version tags on the URLs in the [CRDs kustomization file](crds/kustomization.yaml).

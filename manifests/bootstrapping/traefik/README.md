# Installing Traefik via Helm and Kustomize

We want to do a thing. Let's do it.

## Installing/Patching the CRDs

Because Helm does not support updating/managing CRDs, we can leverage the `crds` directory and add all of the URLs for them in the kustomization file.

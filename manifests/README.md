# Manifests

This directory is broken into three main directories:

1. [Bootstrapping](bootstrapping/)
2. [Services and Applications](workloads/)
3. [ArgoCD Project Manifests](argoprojects/)

## Bootstrapping

This directory homes the raw requirements to get the cluster up and operational. This includes (currently)

1. [Cilium](01-cilium/)
2. [MetalLB](02-metallb/)
3. [Cert-Manager](03-cert-manager/)
4. [External-DNS](04-external-dns/)
5. [Traefik Proxy](05-traefik/)
6. [ArgoCD](06-argocd/)
7. [The ArgoCD Project Manifests to self-update](07-bootstrapping-argoprojects/)

## Services and Applications

This directory homes the serives and applications running in my cluster. Not **everything** is used any longer, but projects that have been deprecated are marked accordingly.

## ArgoCD Project Manifests

The ArgoCD Project Manifests contain the manifests for ArgoCD to manage each of the services which are deployed. This ensures that all projects can be updated by simply updating the main (or otherwise specified) branch for each service.

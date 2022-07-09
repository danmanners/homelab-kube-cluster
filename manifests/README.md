# Manifests

This directory is broken into three main directories:

1. [Bootstrapping](bootstrapping/)
2. [Services and Applications](workloads/)

## Bootstrapping

This directory homes the raw requirements to get the cluster up and operational. This includes (currently)

1. [Cilium](bootstrapping/01-cilium/)
2. [MetalLB](bootstrapping/02-metallb/)
3. [Cert-Manager](bootstrapping/03-cert-manager/)
4. [External-DNS](bootstrapping/04-external-dns/)
5. [Traefik Proxy](bootstrapping/05-traefik/)
6. [ArgoCD](bootstrapping/06-argocd/)
7. [The ArgoCD Project Manifests to self-update](07-bootstrapping-argoprojects/)

## Services and Applications

This directory homes the serives and applications running in my cluster. Not **everything** is used any longer, but projects that have been deprecated are marked accordingly.

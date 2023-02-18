# Bootstrapping On-Prem

In order to provision everything on-prem, we need to deploy the following resources:

1. Container Network Interface - [`cilium`](01-cilium)
2. Load Balancer Controller - [`metallb`](02-metallb)
3. Certificate Management - ['cert-manager`](03-cert-manager)
4. DNS Management - [`external-dns`](04-external-dns)
5. Ingress Controller - [`traefik`](05-traefik)
6. GitOps Controller - [`argocd`](06-argocd)
7. Container Storage Interface - [`csi-driver-nfs`](07-csi-driver-nfs)
8. Monitoring & Metrics - [`08-kube-prom-stack`](08-kube-prom-stack)

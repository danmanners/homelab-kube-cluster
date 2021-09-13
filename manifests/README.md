# Additional Resources **NOT** in GitOps

The following services should be added **MANUALLY** and on a case-by-case basis.

## Applications

* Traefik - Public Service
* [External-DNS](https://github.com/bitnami/charts/tree/master/bitnami/external-dns/)
* ArgoCD

### Traefik - Public Service

In order 

### External-DNS | Digital Ocean

If you are using DigitalOcean as your provider and have your DigitalOcean token saved at `~/.digitalocean/token`, follow these steps.

External-DNS can be installed by running the following `helm` commands:

```bash
# Add the Bitnami Repo
helm repo add bitnami https://charts.bitnami.com/bitnami

# Install External-DNS through Helm for danmanners.com domains.
helm upgrade --install -n kube-system "edns" bitnami/external-dns \
--set digitalocean.apiToken=$(cat ~/.digitalocean/token) \
--set provider=digitalocean \
--set 'domainFilters[0]=danmanners.com' \
--set 'domainFilters[1]=k3s.danmanners.io' \
--set 'crd.create=true'

# If you need to upgrade or add a new domain or additional settings, you can run something like this:
helm upgrade --install -n kube-system "edns" bitnami/external-dns \
--set digitalocean.apiToken=$(cat ~/.digitalocean/token) \
--set provider=digitalocean \
--set 'domainFilters[0]=danmanners.com' \
--set 'domainFilters[1]=danmanners.io' \
--set 'domainFilters[2]=k3s.danmanners.io' \
--set policy=sync \
--set interval=30s \
--set 'crd.create=true'
```

### External-DNS | AWS

If you are using AWS as your provider and have your credentials at `~/.aws/credentials`, follow these steps.

External-DNS can be installed by running the following `helm` commands:

```bash
# Add the Bitnami Repo
helm repo add bitnami https://charts.bitnami.com/bitnami

# Install External-DNS through Helm for danmanners.com domains.
helm upgrade --install -n kube-system "edns" bitnami/external-dns \
--set 'provider=aws' \
--set 'domainFilters[0]=danmanners.com' \
--set 'domainFilters[1]=danmanners.io' \
--set 'domainFilters[2]=k3s.danmanners.io' \
--set 'txtOwnerId=homelab-k3s-danmanners' \
--set 'txtPrefix=txt.' \
--set 'registry=txt' \
--set 'policy=sync' \
--set 'interval=30s' \
--set 'crd.create=true' \
--set 'aws.zoneType=public' \
--set 'aws.credentials.secretName=aws-credentials' \
--set 'aws.credentials.mountPath=/.aws'
```

### ArgoCD

To install ArgoCD, run the following command:

```bash
kubectl apply -k argocd
```

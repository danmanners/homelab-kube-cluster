# Prepping Redis from Bitnami

```bash
# Add the Bitnami Repo
helm repo add bitnami https://charts.bitnami.com/bitnami

# Get the values files
helm show values bitnami/redis-cluster \
    --version 7.1.2 > redis/values.yaml

# Render the Helm Template
helm template redis --create-namespace \
    --namespace ots --version 7.1.2 -f values.yaml \
    bitnami/redis-cluster > helm/rendered-helm.yaml
```

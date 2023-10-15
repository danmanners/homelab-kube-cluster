# Letting ArgoCD Manage the bootstrapping services

After the initial deployment of everything, we can have ArgoCD manage the updates for the bootstrapped services, as well as itself.

```bash
kubectl apply -k manifests/bootstrapping-onprem/11-bootstrapping-argoprojects/
```

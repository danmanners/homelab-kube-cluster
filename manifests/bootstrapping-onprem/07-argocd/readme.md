# Adding in the ArgoCD AWS KMS creds

Assuming your kubeconfig is configured, your AWS creds are set up appropriately for decryption of the encrypted secrets, and if both `kustomize` and `ksops` are installed locally, you can instantiate ArgoCD with the following command

```bash
kustomize build --enable-alpha-plugins | kubectl apply -f -
```

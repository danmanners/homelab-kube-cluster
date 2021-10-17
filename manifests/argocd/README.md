# Adding in the ArgoCD AWS KMS creds

Assuming your kubeconfig is configured, your AWS creds are set up appropriately, and `sops` is installed locally, you can configure the AWS Auth creds with the following command:

```bash
sops --decrypt manifests/argocd/argokms.yaml | kubectl apply -f -
```

This will decrypt and install the credentials into your Kubernetes cluster.

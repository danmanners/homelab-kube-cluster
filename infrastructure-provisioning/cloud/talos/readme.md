# Testing Commands

```bash
GITOPS_REPO='https://github.com/danmanners/homelab-kube-cluster.git' \
GITOPS_REPOTAG='2023-mods' \
TALOS_MASTER_IP='172.29.14.5' \
TALOS_MASTER_PATH='/infrastructure-provisioning/cloud/talos/' \
K8S_BOOTSTRAP_PATH='test' \
./init.sh
```

export GITOPS_REPO='https://github.com/danmanners/homelab-kube-cluster.git'
export GITOPS_REPOTAG='2023-mods'
export TALOS_MASTER_IP='172.29.14.5'
export TALOS_MASTER_PATH='/infrastructure-provisioning/cloud/talos/'
K8S_BOOTSTRAP_PATH='test' \

talosctl apply-config --insecure \
  --nodes 172.29.14.5 \
  --file /gitops/infrastructure-provisioning/cloud/talos/controlplane.yaml

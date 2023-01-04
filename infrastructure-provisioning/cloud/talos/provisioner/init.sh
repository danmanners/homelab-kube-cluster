#!/bin/ash
<<comment
Steps to set up the cluster:

1. Clone the Git repo for the homelab deployment code
2. Use SOPS to decrypt the talos config for provisioning
3. Use talosctl to initialize the cluster
    - Ensure that Wireguard connects to the on-prem cluster (manual)
4. Use talosctl to bootstrap the cluster
5. Use talosctl to get the kubeconfig; put it in ~/.kube/config
6. Use kustomize/ksops/kubectl to kickstart the bootstrapping of services

Variables Necessary:
  - Talos Master IP Address
  - Talos Master config file path
  - Kubernetes Bootstrapping path
  - Git Repo
  - Git Repo Tag (optional)

IAM Requirements
  - KMS for SOPS decryption key
comment

check() {
  if [[ "$1" == "1" ]]; then
    echo "crashed :("
    exit
  fi
}

# Check that all expected variables are set
if [ -z ${GITOPS_REPOTAG+x} ]; then
  export GITOPS_REPOTAG='main'
fi

if [ -z ${GITOPS_REPO+x} ]; then
  echo "'GITOPS_REPO' is not set; ensure it is and re-try running this."
  exit 1
fi

if [ -z ${TALOS_MASTER_IP+x} ]; then
  echo "'TALOS_MASTER_IP' is not set; ensure it is and re-try running this."
  exit 1
fi

if [ -z ${TALOS_MASTER_PATH+x} ]; then
  echo "'TALOS_MASTER_PATH' is not set; ensure it is and re-try running this."
  exit 1
fi

if [ -z ${K8S_BOOTSTRAP_PATH+x} ]; then
  echo "'K8S_BOOTSTRAP_PATH' is not set; ensure it is and re-try running this."
  exit 1
fi 

# 1 - Clone the repo
rm -rf /gitops
git clone --depth 1 \
  -b ${GITOPS_REPOTAG} \
  "${GITOPS_REPO}" /gitops \
  && cd /gitops

# 2 - Decrypt the master TalosCTL file
sops -d -i /gitops/${TALOS_MASTER_PATH}/controlplane.yaml
check $?

# 3 - Apply the Talos master config file
talosctl apply-config --insecure \
  --nodes ${TALOS_MASTER_IP} \
  --file /gitops/${TALOS_MASTER_PATH}/controlplane.yaml
check $?
# Create the talos configpath
mkdir -p ~/.talos
sops -d -i /gitops/${TALOS_MASTER_PATH}/talosconfig
cp /gitops/${TALOS_MASTER_PATH}/talosconfig ~/.talos/config
# Set the endpoint
talosctl config endpoint ${TALOS_MASTER_IP}
check $?

# 4 - Wait for a bit, then bootstrap
sleep 60 && talosctl bootstrap
check $?

# 5 - Get the kubeconfig
talosctl kubeconfig \
  --nodes ${TALOS_MASTER_IP} \
  ~/.kube/config

# 6 - 
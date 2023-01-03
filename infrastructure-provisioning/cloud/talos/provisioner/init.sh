#!/bin/sh
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

# Variables
export VARS="GITOPS_REPO GITOPS_REPOTAG TALOS_MASTER_IP TALOS_MASTER_PATH K8S_BOOTSTRAP_PATH"

# Check that all expected variables are set
for var in $VARS; do
  if [[ "${var}" == "GITOPS_REPOTAG" ]]; then
    export GITOPS_REPOTAG='main'
  elif [[ ! -v "${var}" ]]; then
      echo "The '${var}' is not set; ensure it is and re-try running this."
      exit 1
  fi;
done

# 1 - Clone the repo
git clone --depth 1 \
  -b ${GITOPS_REPOTAG} \
  "${GITOPS_REPO}" /gitops \
  && cd /gitops

# 2 - Decrypt the master TalosCTL file
sops --decrypt --insecure \
  /gitops/${TALOS_MASTER_PATH}/controlplane.yaml

# 3 - Apply the Talos master config file
talosctl apply-config --insecure \
  --nodes ${TALOS_MASTER_IP} \
  --file /gitops/${TALOS_MASTER_PATH}/controlplane.yaml
# Create the talos configpath
mkdir -p ~/.talos
cp /gitops/${TALOS_MASTER_PATH}/talosconfig ~/.talos/config
# Set the endpoint
talosctl config endpoint ${TALOS_MASTER_IP}

# 4 - Wait for a bit, then bootstrap
sleep 60 && talosctl bootstrap

# 5 - Get the kubeconfig
talosctl kubeconfig \
  --nodes ${TALOS_MASTER_IP} \
  ~/.kube/config

# 6 - 
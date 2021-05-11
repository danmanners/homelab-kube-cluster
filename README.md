# K3s Homelab - Turing Pi + Proxmox

Much of this repo is based on the [k3s-io/k3s-ansible](https://github.com/k3s-io/k3s-ansible) repository, with heavy modifications and additions to support an `x64` host supported control plane and two worker nodes. Two Turing Pi units are in use to host ten Raspberry Pi CM3+ units running Ubuntu 20.04 running as `aarch64` worker nodes.

Ultimately, this repo provisions a highly-available control plane with a Postgres backend for ETCD with both `x64` and `aarch64` worker nodes.

## Setup

Follow these steps in order to set up your local environment.

### Install

```bash
ansible-galaxy collection install -r requirements.yaml
```

## Deploying Everything

You can simply deploy all your infrastructure with the following commmand

```bash
# Install and initialize the K3s Cluster
ansible-playbook site.yaml -i inventory/my-cluster/hosts.ini --ask-vault-pass

# SCP the Kubeconfig File
mkdir -p ~/.kube && HOST_USER="ubuntu" FIRST_CONTROL_PLANE_NODE="10.45.0.35" \
scp $HOST_USER@$FIRST_CONTROL_PLANE_NODE:~/.kube/config ~/.kube/k3s-config

# Install ArgoCD
kubectl --kubeconfig ~/.kube/k3s-config create namespace argocd
kubectl --kubeconfig ~/.kube/k3s-config apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Install Kube Prometheus Stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && helm repo update
helm install --kubeconfig ~/.kube/k3s-config kube-prom-stack --namespace kube-system prometheus-community/kube-prometheus-stack
```

If you'd like to set your own password for ArgoCD, you can use the included Python script to generate the password.

```bash
# Set up a python3 virtual Environment
python3 -m venv .env

# Activate the Virtual Environment
source .env/bin/activate

# Ensure that Pip is up to date and that the required libraries are installed
pip install -U pip && pip install -r pip_req.txt

# Generate your bcrypt 
export ARGO_PASSWORD="$(python genArgoPassword.py 'PasswordGoesHere')"

# Update the Password for ArgoCD
kubectl --kubeconfig ~/.kube/k3s-config -n argocd patch secret argocd-secret \
  -p "{
    \"stringData\": { \"admin.password\": \"$ARGO_PASSWORD\",
    \"admin.passwordMtime\": \"$(date +%FT%T%Z)\"
  }}"
```

## Removing Everything

If you want to remove your K3s Install, you can run the following commands:

```bash
ansible-playbook uninstall.yaml -i inventory/my-cluster/hosts.ini --ask-vault-pass

# Once that succeeds, SSH to your postgres host and connect to the local postgres database
$> psql -U turingpi-k3s -h localhost -p 5432 -d kubernetes
Password for user turingpi-k3s:
kubernetes=> truncate kine;
TRUNCATE TABLE
kubernetes=> drop sequence kine_id_seq cascade;
NOTICE:  drop cascades to default for table kine column id
DROP SEQUENCE
kubernetes=> drop table kine;
DROP TABLE
\q
```

## Future Work

Below this line is scratchpad code that I'd like to use in the near future or this project.
### Creating your Postgres X509 Certs

Run the following commands from a Linux, MacOS, or Windows 10 WSL2 environment to generate all of the necessary certificates:

```bash
# Create a Keys Directory
mkdir -p keys

# Generate the Self-Signed Cert with a 10-year life (3650 days)
openssl req -new -x509 -newkey rsa:4096 \
  -days 3650 -nodes -out ca.crt -keyout ca.key \
  -subj '/C=US/ST=North Carolina/L=Raleigh/O=Good Manners Hosting/CN=Turing Pi K3s Postgres'

# Set Key Permissions
chmod 0400 ca.key

# Create a CSR with a 5-year life (1827 days)
openssl req -nodes -new \
  -out client.csr -keyout client.key \
  -subj '/C=US/ST=North Carolina/L=Raleigh/O=Good Manners Hosting/CN=k3s-postgres.danmanners.io'

# Sign the CSR
openssl x509 -req -days 1827 \
  -in client.csr -out client.crt \
  -CA ca.crt -CAkey ca.key \
  -set_serial $(openssl rand -base64 128 | sed 's/[^0-9]*//g' | paste -sd+ - | bc)
```


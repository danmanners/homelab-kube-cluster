# K3s Homelab - Turing Pi + Proxmox

Much of this repo is based on the [k3s-io/k3s-ansible](https://github.com/k3s-io/k3s-ansible) repository, with heavy modifications and additions to support an `x64` host supported control plane and ETCD nodes. 2x Turing Pi units are in use to host 10x Raspberry Pi CM3+ units running Ubuntu 20.04 acting as `aarch64` worker nodes.

## Setup

Follow these steps in order to set up your local environment.

### Install

```bash
ansible-galaxy collection install -r requirements.yaml
```

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

## Deploying Everything

You can simply deploy all your infrastructure with the following commmand

```bash
ansible-playbook site.yaml -i inventory/my-cluster/hosts.ini --ask-vault-pass
```

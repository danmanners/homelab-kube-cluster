# K3s Homelab - Turing Pi + Proxmox

Much of this repo is based on the [k3s-io/k3s-ansible](https://github.com/k3s-io/k3s-ansible) repository, with heavy modifications and additions to support an `x64` host supported control plane and ETCD nodes. 2x Turing Pi units are in use to host 10x Raspberry Pi CM3+ units running Ubuntu 20.04 acting as `aarch64` worker nodes.

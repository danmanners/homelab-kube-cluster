# Deprecation Notices

Anything and everything under this directory has been deprecated from my homelab. I'm leaving information here in order to allow anyone to follow along with my past decisions and logic.

## Deprecated Services

The services listed below once existed in the cluster, but have since been removed for one reason or another

| Name                       | Deprecation Reason                                   | Description                                                                             | Path                                                                                                                                                      | Relevant Link                                                                                         |
| -------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Luzifer - One Time Secret  | No longer using it                                   | One-Time-Secret sharing platform with a symmetric 256bit AES encryption in the browser. | [manifests/workloads/luzifer-ots](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/luzifer-ots)                           | [GitHub - Luzifer/ots](https://github.com/Luzifer/ots)                                                |
| Non-Disclosure-Agreement   | No longer using it                                   | Flask app to obfuscate URL's and strings for obfuscated sharing of information.         | [manifests/workloads/non-disclosure-agreement](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/non-disclosure-agreement) | [GitHub - danmaners/non-disclosure-agreement](https://github.com/danmanners/non-disclosure-agreement) |
| Open Policy Agent          | Made obsolete by Kyverno                             | Policy-based control for cloud native environments                                      | [manifests/workloads/open-policy-agent](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/open-policy-agent)               | [Website](https://www.openpolicyagent.org/)                                                           |
| Proxmox                    | No longer using virtualization in my on-prem homelab | Compute, network, and storage in a single solution                                      | N/A                                                                                                                                                       | [Website](https://www.proxmox.com/en/proxmox-ve)                                                      |
| Rancher Upgrade Controller | Removed from the cluster when I moved away from K3s  | In ur Kubernetes, upgrading ur nodes                                                    | [manifests/workloads/k3s-upgrade-controller](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/k3s-upgrade-controller)     | [GitHub - rancher/system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)    |

### Removed Tech Stack

Several items have previously been in my cluster, but have been removed over time for one reason or another. Those items can be foud below.

| Name                                                          | Removal Reason                                                             | Description                                                       |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                           | I don't need host provisioning anymore                                     | Ad-hoc system configuration-as-code                               |
| [Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/)      | I standardized on Talos OS                                                 | Operating System                                                  |
| [Flannel CNI](https://github.com/flannel-io/flannel)          | I migrated to Cilium for my CNI                                            | Network Fabric for Containers                                     |
| [K3s](https://k3s.io/)                                        | I moved to Talos for Kubernetes                                            | Lightweight Kubernetes                                            |
| [Harbor](https://goharbor.io/)                                | Kept crashing; logging was nearly useless. Might go back to it later, TBD. | Open Source Container and Helm Registry                           |
| [KubeLogin](https://github.com/int128/kubelogin)              | This was more of a hassle than anything, but worked perfectly well         | kubectl plugin for Kubernetes OpenID Connect authentication       |
| [NGINX](https://www.nginx.com/)                               | This was no longer necessary with my edge TalosOS nodes                    | Open-Source Web Server and Reverse Proxy                          |
| [Proxmox](https://www.proxmox.com/en/proxmox-ve)              | Moved to fully baremetal Kubernetes on Talos OS                            | Virtualization Platform                                           |
| [QEMU Guest Agent](https://wiki.qemu.org/Features/GuestAgent) | No longer necessary without virtualized on-prem infrastructure             | Provides access to a system-level agent via standard QMP commands |
| [QNAP](https://www.qnap.com/en-us)                            | After an OS upgrade, NFS broke; built a new Array utilizing ZFS            | Storage Array Hardware and Networking                             |
| [Rocky Linux](https://rockylinux.org/)                        | I standardized on Talos OS                                                 | Open-Source Enterprise Linux; Spiritual successor to CentOS       |
| [Turing Pi 1](https://turingpi.com/v1/)                       | I can't run Talos OS on the Turing Pi CM3+ nodes                           | Raspberry Pi Compute Module Clustering                            |
| [Turing Pi 2](https://turingpi.com/)                          | The persistent storage options weren't enough with TalosOS                 | Raspberry Pi Compute Module Clustering                            |

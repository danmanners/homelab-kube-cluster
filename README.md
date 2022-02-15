# Dan Manners' Homelab

Current status: **BETA** (but mostly stable)

This project aims to utilize industry-standard tooling and practices in order to both perform it's functions and act as a repository for people to reference for their own learning and work.

[![k3s](https://img.shields.io/badge/k3s-v1.22.5-brightgreen?style=for-the-badge&logo=kubernetes&logoColor=white)](https://k3s.io/)

## 🔍 Features

- [x] Easy to replicate GitOps
- [x] Modularity; make it easy to add/remove components
- [x] Hybrid Multi-Cloud
- [x] External DNS updates
- [x] Automagic cert management
- [x] Cluster SSO through GitHub
- [ ] Monitoring and alerting 🚧
- [ ] Multiple environment support 🚧
- [ ] Automated Backups 🚧

## 💡 Tech Stack

| Name                                                            | Description                                                 |
|-----------------------------------------------------------------|-------------------------------------------------------------|
| [Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/)        | Operating System                                            |
| [Ansible](https://www.ansible.com/)                             | Ad-hoc system configuration-as-code                         |
| [ArgoCD](https://argoproj.github.io/cd/)                        | GitOps for Kubernetes                                       |
| [AWS](https://aws.amazon.com/)                                  | Cloud Provider                                              |
| [Buildah](https://github.com/containers/buildah/)               | Container Building                                          |
| [Cert-Manager](https://cert-manager.io/docs/)                   | Certificate Manager                                         |
| [Cilium](https://cilium.io/)                                    | CNI utilizing eBPF for Observability and Security           |
| [Dex](https://dexidp.io/)                                       | Federated OIDC                                              |
| [External-DNS](https://github.com/kubernetes-sigs/external-dns) | Configure and manage External DNS servers                   |
| [GitHub](https://github.com/)                                   | Popular Code Management through Git                         |
| [Grafana](https://grafana.com/)                                 | Metrics Visualization                                       |
| [Helm](https://helm.sh/)                                        | Kubernetes Package Management                               |
| [Jenkins](https://www.jenkins.io/)                              | Open-Source Automation Server                               |
| [K3s](https://k3s.io/)                                          | Lightweight Kubernetes                                      |
| [Kubernetes](https://kubernetes.io/)                            | Container Orchestration                                     |
| [Let's Encrypt](https://letsencrypt.org/)                       | Free TLS certificates                                       |
| [MetalLB](https://metallb.universe.tf/)                         | Kubernetes bare-metal Load Balancer                         |
| [Microsoft Azure](https://azure.microsoft.com/en-us/)           | Cloud Provider                                              |
| [Mozilla SOPS](https://github.com/mozilla/sops)                 | Simple/Flexible Tool                                        |
| [NGINX](https://www.nginx.com/)                                 | Open-Source Web Server and Reverse Proxy                    |
| [Podman](https://github.com/containers/podman/)                 | Container and Pod management                                |
| [Prometheus](https://prometheus.io/)                            | Metrics and Data Collection                                 |
| [Proxmox](https://www.proxmox.com/en/proxmox-ve)                | Virtualization Platform                                     |
| [Python](https://www.python.org/)                               | Python Programming Language                                 |
| [QNAP](https://www.qnap.com/en-us)                              | Storage Array Hardware and Networking                       |
| [Raspberry Pi](https://www.raspberrypi.org/)                    | Baremetal ARM SoC Hardware!                                 |
| [Rocky Linux](https://rockylinux.org/)                          | Open-Source Enterprise Linux; Spiritual successor to CentOS |
| [SonarQube](https://www.sonarqube.org/)                         | Static code analysis                                        |
| [Tekton](https://tekton.dev/)                                   | Cloud-Native CI/CD                                          |
| [Terraform](https://www.terraform.io/)                          | Open-Source Infrastructure-as-Code                          |
| [Terragrunt](https://terragrunt.gruntwork.io/)                  | Making Terraform DRY                                        |
| [Turing Pi](https://turingpi.com/)                              | Raspberry Pi Compute Module Clustering                      |
| [Ubuntu](https://ubuntu.com/)                                   | Operating System                                            |
| [Uptime Kuma](https://github.com/louislam/uptime-kuma)          | Fancy self-hosted system monitoring                         |
| [WikiJS](https://js.wiki/)                                      | Open-Source Wiki/Documentation Service                      |

## Services Hosted

| Name                       | Description                                                                             | Path                                                                                                                                                         | Relevant Link                                                                                                                           |
|----------------------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| Excalidraw                 | Easy whiteboarding with excellent shortcuts!                                            | [manifests/workloads/excalidraw](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/excalidraw)                                 | [GitHub - excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)                                                              |
| Jenkins OSS                | An older tool sir, but it checks out.                                                   | [manifests/workloads/jenkins-oss](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/jenkins-oss)                               | [Website](https://www.jenkins.io/)                                                                                                      |
| Rancher Upgrade Controller | In your Kubernetes, upgrading your nodes                                                | [manifests/workloads/k3s-upgrade-controller](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/k3s-upgrade-controller)         | [GitHub - rancher/system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)                                      |
| Kube-Prometheus-Stack      | Easy to deploy Grafana, Prometheus rules, and the Prometheus Operator.                  | [manifests/workloads/kube-prometheus-stack-grafana](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/kube-prom-stack-grafana) | [GitHub - prometheus-community/helm-charts](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) |
| Luzifer - One Time Secret  | One-Time-Secret sharing platform with a symmetric 256bit AES encryption in the browser. | [manifests/workloads/luzifer-ots](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/luzifer-ots)                               | [GitHub - Luzifer/ots](https://github.com/Luzifer/ots)                                                                                  |
| Memegen                    | The free and open source API to generate memes.                                         | [manifests/workloads/memegen](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/memegen)                                       | [GitHub - jacebrowning/memegen](https://github.com/jacebrowning/memegen)                                                                |
| Node-Feature-Discovery     | Node feature discovery for Kubernetes                                                   | [manifests/workloads/node-feature-discovery](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/node-feature-discovery)         | [GitHub - kubernetes-sigs/node-feature-discovery](https://github.com/kubernetes-sigs/node-feature-discovery)                            |
| Non-Disclosure-Agreement   | Flask app to obfuscate URL's and strings for obfuscated sharing of information.         | [manifests/workloads/non-disclosure-agreement](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/non-disclosure-agreement)     | [GitHub - danmaners/non-disclosure-agreement](https://github.com/danmanners/non-disclosure-agreement)                                   |
| Open Policy Agent          | Policy-based control for cloud native environments                                      | [manifests/workloads/open-policy-agent](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/open-policy-agent)                   | [Website](https://www.openpolicyagent.org/)                                                                                             |
| OpenFaaS                   | Serverless functions, made simple!                                                      | [manifests/workloads/openfaas-ingress](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/openfaas-ingress)                     | [Website](https://www.openfaas.com/)                                                                                                    |
| SonarQube OSS              | Code quality and code security                                                          | [manifests/workloads/sonarqube-oss](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/sonarqube-oss)                           | [Website](https://www.sonarqube.org/)                                                                                                   |
| Spiderfoot                 | Automated OSINT webcrawling                                                             | [manifests/workloads/spiderfoot](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/spiderfoot)                                 | [Website](https://www.spiderfoot.net/)                                                                                                  |
| Traefik                    | Cloud native application proxying; simplifying network complexity                       | [manifests/workloads/traefik-helm](https://github.com/danmanners/homelab-k3s-cluster/tree/main/manifests/workloads/traefik-helm)                             | [Website](https://traefik.io/traefik/)                                                                                                  |

### Proxied Services

| Name        | Description                                                | Link                                              |
|-------------|------------------------------------------------------------|---------------------------------------------------|
| Proxmox     | Compute, network, and storage in a single solution         | [Website](https://www.proxmox.com/en/proxmox-ve)  |
| Uptime Kuma | A fancy self-hosted monitoring tool                        | [GitHub](https://github.com/louislam/uptime-kuma) |
| WikiJS      | The most powerful and extensible open source Wiki software | [Website](https://js.wiki/)                       |

## 🔧 Hardware

Below is a list of the hardware (both physical and virtual) in use on this project

### 🖥 On-Prem Systems

-----

#### Virtualization Hosts

| Count | System Type | CPU Type            | CPU Cores | Memory |
|-------|-------------|---------------------|-----------|--------|
| 1     | Desktop     | Intel Core i7-7700  | 4c8t      | 64GiB  |
| 1     | Desktop     | AMD Ryzen 7 5800X   | 8c16t     | 64GiB  |
| 1     | Desktop     | Intel Celeron J4105 | 4c4t      | 16GiB  |
| 1     | Desktop     | AMD Ryzen 5 3400G   | 4c8t      | 32GiB  |

#### Cluster Boards

| Count | System Type  | CPU Type             | CPU Cores | Memory  |
|-------|--------------|----------------------|-----------|---------|
| 1     | Turing Pi v1 | 7x Raspberry Pi CM3+ | 4c4t      | 7x 1GiB |
| 1     | Turing Pi v1 | 3x Raspberry Pi CM3+ | 4c4t      | 3x 1GiB |
| 1     | Turing Pi v2 | 4x Raspberry Pi CM4  | 4c4t      | 4x 8GiB |

#### Additional Compute

| Count | System Type    | CPU Type         | CPU Cores | Memory |
|-------|----------------|------------------|-----------|--------|
| 2     | Raspberry Pi 4 | Raspberry Pi CM4 | 4c4t      | 8GiB   |

#### Storage

| Hardware     | Drive Count             | Memory |
|--------------|-------------------------|--------|
| QNAP TS-332X | 3x M.2, 3x 3.5" 7200RPM | 16GiB  |

#### Networking

| Hardware                    | SFP+ Ports | SFP Ports | 1Gb Eth Ports |
|-----------------------------|------------|-----------|---------------|
| Ubiquiti EdgeSwitch 24 Lite | 0          | 2         | 24            |
| Ubiquiti EdgeSwitch 8 150W  | 0          | 2         | 8             |
| Mikrotik CRS305-1G-4S+      | 4          | 0         | 1 (PoE In)    |

### Cloud Hosted Resources

| Name               | Provider | CPU   | Memory |
|--------------------|----------|-------|--------|
| tpi-k3s-aws-edge   | AWS      | 2vCPU | 4GiB   |
| tpi-k3s-azure-edge | Azure    | 2vCPU | 4GiB   |

## Gratitude and Thanks

This README redesign was inspired by several other homelab repos, individuals, and communities.

### Individuals

-----

- [zimmertr/TKS](https://github.com/zimmertr/TKS)
- [onedr0p/home-ops](https://github.com/onedr0p/home-ops/)
- [khuedoan/homelab](https://github.com/khuedoan/homelab)

### Communities

-----

#### The DevOps Lounge

[![Discord](https://img.shields.io/discord/611083841792376843?style=for-the-badge&label=discord&logo=discord&logoColor=white)](https://discord.gg/devopslounge)

#### K8s-at-Home

[![Discord](https://img.shields.io/discord/673534664354430999?style=for-the-badge&label=discord&logo=discord&logoColor=white)](https://discord.gg/k8s-at-home)

Without the inspiration and help of these individuals and communities, I don't think my own project would be nearly as far. Make sure to check out their projects as well!

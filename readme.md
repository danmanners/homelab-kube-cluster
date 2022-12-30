# Dan Manners' Homelab

> <strong>Notice - </strong> This repository is on hold for a little while I'm working on non-tech related things. I'm planning on being back early 2023 in full swing, working on more Kubernetes and cloud things in the homelab! 🙂

Current status: **BETA** (but is highly stable)

This project aims to utilize industry-standard tooling and practices in order to both perform it's functions and act as a repository for people to reference for their own learning and work.

## 🔍 Features

- [x] Easy to replicate GitOps
- [x] Modularity; make it easy to add/remove components
- [x] Hybrid Multi-Cloud
- [x] External DNS updates
- [x] Automagic cert management
- [x] In-Cluster Container Registry
- [ ] Monitoring and alerting 🚧
- [ ] Automated Backups 🚧
- [x] ~~Cluster SSO through GitHub~~ - Removed when switching from K3s to Talos

## 💡 Current Tech Stack

| Name                                                                     | Description                                                                   |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| [ArgoCD](https://argoproj.github.io/cd/)                                 | GitOps for Kubernetes                                                         |
| [AWS](https://aws.amazon.com/)                                           | Cloud Provider                                                                |
| [Blocky](https://github.com/0xERR0R/blocky)                              | Fast and lightweight DNS proxy as ad-blocker                                  |
| [Buildah](https://github.com/containers/buildah/)                        | Container Building                                                            |
| [Cert-Manager](https://cert-manager.io/docs/)                            | Certificate Manager                                                           |
| [Cilium](https://cilium.io/)                                             | CNI utilizing eBPF for Observability and Security                             |
| [CloudNativePG](https://cloudnative-pg.io/)                              | Kubernetes operator covering lifecycle of HA PostgreSQL Clusters              |
| [CSI-Driver-NFS](https://github.com/kubernetes-csi/csi-driver-nfs)       | Kubernetes NFS Driver for persistent storage                                  |
| [Dex](https://dexidp.io/)                                                | Federated OIDC                                                                |
| [External-DNS](https://github.com/kubernetes-sigs/external-dns)          | Configure and manage External DNS servers                                     |
| [GitHub](https://github.com/)                                            | Popular Code Management through Git                                           |
| [Grafana](https://grafana.com/)                                          | Metrics Visualization                                                         |
| [Helm](https://helm.sh/)                                                 | Kubernetes Package Management                                                 |
| [Jenkins](https://www.jenkins.io/)                                       | Open-Source Automation Server                                                 |
| [Kubernetes](https://kubernetes.io/)                                     | Container Orchestration                                                       |
| [Kyverno](https://kyverno.io/)                                           | Kubernetes Native Policy Management                                           |
| [Let's Encrypt](https://letsencrypt.org/)                                | Free TLS certificates                                                         |
| [Maddy](https://github.com/foxcpp/maddy)                                 | Composable all-in-one mail server                                             |
| [MetalLB](https://metallb.universe.tf/)                                  | Kubernetes bare-metal Load Balancer                                           |
| [Microsoft Azure](https://azure.microsoft.com/en-us/)                    | Cloud Provider                                                                |
| [Mozilla SOPS](https://github.com/mozilla/sops)                          | Simple/Flexible Tool                                                          |
| [Podman](https://github.com/containers/podman/)                          | Container and Pod management                                                  |
| [Prometheus](https://prometheus.io/)                                     | Metrics and Data Collection                                                   |
| [Python](https://www.python.org/)                                        | Python Programming Language                                                   |
| [Raspberry Pi](https://www.raspberrypi.org/)                             | Baremetal ARM SoC Hardware!                                                   |
| [Reloader](https://github.com/stakater/Reloader)                         | Kubernetes controller to watch cm's and secrets and reloads pods              |
| [SonarQube](https://www.sonarqube.org/)                                  | Static code analysis                                                          |
| [Sonatype Nexus-OSS](https://www.sonatype.com/products/nexus-repository) | Manage binaries and build artifacts                                           |
| [Talos](https://talos.dev/)                                              | Secure, immutable, and minimal Linux OS                                       |
| [Tekton](https://tekton.dev/)                                            | Cloud-Native CI/CD                                                            |
| [Terraform](https://www.terraform.io/)                                   | Open-Source Infrastructure-as-Code                                            |
| [Terragrunt](https://terragrunt.gruntwork.io/)                           | Making Terraform DRY                                                          |
| [Ubuntu](https://ubuntu.com/)                                            | Operating System                                                              |
| [Uptime Kuma](https://github.com/louislam/uptime-kuma)                   | Fancy self-hosted system monitoring                                           |
| [Vaultwarden](https://github.com/dani-garcia/vaultwarden)                | Unofficial Bitwarden compatible server written in Rust; formerly bitwarden_rs |
| [WikiJS](https://js.wiki/)                                               | Open-Source Wiki/Documentation Service                                        |

## Services Hosted

| Name                   | Description                                                            | Path                                                                                                                                                          | Relevant Link                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Excalidraw             | Easy whiteboarding with excellent shortcuts!                           | [manifests/workloads/excalidraw](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/excalidraw)                                 | [GitHub - excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)                                                              |
| Jenkins OSS            | An older tool sir, but it checks out.                                  | [manifests/workloads/jenkins-oss](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/jenkins-oss)                               | [Website](https://www.jenkins.io/)                                                                                                      |
| Kube-Prometheus-Stack  | Easy to deploy Grafana, Prometheus rules, and the Prometheus Operator. | [manifests/workloads/kube-prometheus-stack-grafana](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/kube-prom-stack-grafana) | [GitHub - prometheus-community/helm-charts](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) |
| Memegen                | The free and open source API to generate memes.                        | [manifests/workloads/memegen](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/memegen)                                       | [GitHub - jacebrowning/memegen](https://github.com/jacebrowning/memegen)                                                                |
| Node-Feature-Discovery | Node feature discovery for Kubernetes                                  | [manifests/workloads/node-feature-discovery](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/node-feature-discovery)         | [GitHub - kubernetes-sigs/node-feature-discovery](https://github.com/kubernetes-sigs/node-feature-discovery)                            |
| OpenFaaS               | Serverless functions, made simple!                                     | [manifests/workloads/openfaas-ingress](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/openfaas-ingress)                     | [Website](https://www.openfaas.com/)                                                                                                    |
| SonarQube OSS          | Code quality and code security                                         | [manifests/workloads/sonarqube-oss](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/sonarqube-oss)                           | [Website](https://www.sonarqube.org/)                                                                                                   |
| Spiderfoot             | Automated OSINT webcrawling                                            | [manifests/workloads/spiderfoot](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/spiderfoot)                                 | [Website](https://www.spiderfoot.net/)                                                                                                  |
| Traefik                | Cloud native application proxying; simplifying network complexity      | [manifests/bootstrapping/traefik](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/traefik-helm)                              | [Website](https://traefik.io/traefik/)                                                                                                  |
| WikiJS                 | The most powerful and extensible open source Wiki software             | [manifests/workloads/wikijs](https://github.com/danmanners/homelab-kube-cluster/tree/main/manifests/workloads/wikijs)                                         | [Website](https://js.wiki/)                                                                                                             |

## Deployment Order of Operations

While this section is a Work-in-Progress, I'd like to provide some relevant information on core services that must be deployed and in which order.

1. [Talos Linux](talos/)
2. [Cilium CNI](manifests/bootstrapping/01-cilium/)
3. [MetalLB](manifests/bootstrapping/02-metallb/)
4. [Cert-Manager](manifests/bootstrapping/03-cert-manager/)
5. [External-DNS](manifests/bootstrapping/04-external-dns/)
6. [Traefik](manifests/bootstrapping/05-traefik/)
7. [ArgoCD - Part One](manifests/bootstrapping/06-argocd/)
8. [ArgoCD - Part Two](manifests/bootstrapping/07-bootstrapping-argoprojects/)

## Identifying Problems, Troubleshooting Steps, and more

Below are a few things that may be beneficial to you when troubleshooting or getting things up and operational

### Traffic is not getting from the edge (cloud) nodes to the on-prem cluster networking

You can validate that your remote traffic is or isn't making it on site by using `dig` inside of the [netshoot container]()

```bash
kubectl run temp-troubleshooting \
  --rm -it -n default \
  --overrides='{"apiVersion":"v1","spec":{"nodeSelector":{"kubernetes.io/hostname":"talos-aws-grav01"}}}' \
  --pod-running-timeout 3m \
  --image=docker.io/nicolaka/netshoot:latest \
  --command -- /bin/bash
```

Then, you can validate that you can reach CoreDNS or another pod/service IP from your remote node.

If you can prove it is not working, you may want to restart all of Cilium:

```bash
kubectl rollout restart -n kube-system daemonset cilium
```

## To-Do Items

- Ensure that **ALL** services are tagged for the appropriate hardware (`arm64` or `amd64`) to ensure runtime success
  - Alternatively, ensure that all containers are built for multi-architecture.
- Ensure that **ALL** application and service subdirectories have READMEs explaining what they're doing and what someone else may need to modify for their own environment

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

# Dan Manners' Homelab

> All of the readme's are in a state of flux at this moment. I'm working on refactoring much of the repository, but I'm happy to answer any questions in the [k8s@Home Discord server](https://discord.gg/k8s-at-home) or on Discord! Feel free to reach me at `danmanners` with any questions or at [daniel.a.manners@gmail.com](mailto:daniel.a.manners@gmail.com)!

Current status:
  
This project aims to utilize industry-standard tooling and practices in order to both perform it's functions and act as a repository for people to reference for their own learning and work.

## 🔍 Features

- [x] Easy to replicate GitOps
- [x] Modularity; make it easy to add/remove components
- [x] Hybrid Multi-Cloud
- [x] External DNS updates
- [x] Automagic cert management
- [x] In-Cluster Container Registry
- [ ] Monitoring and alerting 🚧

## 💡 Current Tech Stack

| Name                                                                     | Description                                                      |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| [ArgoCD](https://argoproj.github.io/cd/)                                 | GitOps for Kubernetes                                            |
| [AWS](https://aws.amazon.com/)                                           | Cloud Provider                                                   |
| [Blocky](https://github.com/0xERR0R/blocky)                              | Fast and lightweight DNS proxy as ad-blocker                     |
| [Buildah](https://github.com/containers/buildah/)                        | Container Building                                               |
| [Cert-Manager](https://cert-manager.io/docs/)                            | Certificate Manager                                              |
| [Cilium](https://cilium.io/)                                             | CNI utilizing eBPF for Observability and Security                |
| [CloudNativePG](https://cloudnative-pg.io/)                              | Kubernetes operator covering lifecycle of HA PostgreSQL Clusters |
| [CSI-Driver-NFS](https://github.com/kubernetes-csi/csi-driver-nfs)       | Kubernetes NFS Driver for persistent storage                     |
| [Dex IDP](https://dexidp.io/)                                            | Federated OIDC                                                   |
| [External-DNS](https://github.com/kubernetes-sigs/external-dns)          | Configure and manage External DNS servers                        |
| [GitHub](https://github.com/)                                            | Popular Code Management through Git                              |
| [Grafana](https://grafana.com/)                                          | Metrics Visualization                                            |
| [Harbor](https://goharbor.io/)                                           | Open Source Container Registry                                   |
| [Helm](https://helm.sh/)                                                 | Kubernetes Package Management                                    |
| [Jenkins](https://www.jenkins.io/)                                       | Open-Source Automation Server                                    |
| [Kubernetes](https://kubernetes.io/)                                     | Container Orchestration                                          |
| [Let's Encrypt](https://letsencrypt.org/)                                | Free TLS certificates                                            |
| [Maddy](https://github.com/foxcpp/maddy)                                 | Composable all-in-one mail server                                |
| [MetalLB](https://metallb.universe.tf/)                                  | Kubernetes bare-metal Load Balancer                              |
| [Mozilla SOPS](https://github.com/mozilla/sops)                          | Simple/Flexible Tool                                             |
| [Podman](https://github.com/containers/podman/)                          | Container and Pod management                                     |
| [Prometheus](https://prometheus.io/)                                     | Metrics and Data Collection                                      |
| [Python](https://www.python.org/)                                        | Python Programming Language                                      |
| [Raspberry Pi](https://www.raspberrypi.org/)                             | Baremetal ARM SoC Hardware!                                      |
| [SonarQube](https://www.sonarqube.org/)                                  | Static code analysis                                             |
| [Sonatype Nexus-OSS](https://www.sonatype.com/products/nexus-repository) | Manage binaries and build artifacts                              |
| [Tekton](https://tekton.dev/)                                            | Cloud-Native CI/CD                                               |
| [Ubuntu](https://ubuntu.com/)                                            | Operating System                                                 |
| [Uptime Kuma](https://github.com/louislam/uptime-kuma)                   | Fancy self-hosted system monitoring                              |
| [WikiJS](https://js.wiki/)                                               | Open-Source Wiki/Documentation Service                           |

## Deployment Order of Operations

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

- [zimmertr/TKS](https://github.com/zimmertr/TKS)
- [onedr0p/home-ops](https://github.com/onedr0p/home-ops/)
- [khuedoan/homelab](https://github.com/khuedoan/homelab)

### Communities

---

#### The DevOps Lounge

[![Discord](https://img.shields.io/discord/611083841792376843?style=for-the-badge&label=discord&logo=discord&logoColor=white)](https://discord.gg/devopslounge)

#### K8s-at-Home

[![Discord](https://img.shields.io/discord/673534664354430999?style=for-the-badge&label=discord&logo=discord&logoColor=white)](https://discord.gg/k8s-at-home)

Without the inspiration and help of these individuals and communities, I don't think my own project would be nearly as far. Make sure to check out their projects as well!


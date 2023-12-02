import { Node } from "../types/types";

// Cloud Setup Values
export const cloud_auth = {
  aws_region: "us-east-1",
  aws_profile: "default",
};

export const user_data = {
  kube: `
#cloud-config
users:
  - name: dan
    shell: /bin/bash
    sudo: "ALL=(ALL) NOPASSWD:ALL"
    ssh_import_id:
      - gh:danmanners
`,
  bastion: `
#cloud-config
users:
  - name: dan
    shell: /bin/bash
    sudo: "ALL=(ALL) NOPASSWD:ALL"
    ssh_import_id:
      - gh:danmanners
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPnxXDQnY00BUZ5oS2526MHea12VjJUE60pAIbuYHopi Dan Manners <daniel.a.manners@gmail.com>
`,
};

export const general = {
  domain: "cloud.danmanners.com",
  kube_cp_hostname: "kube",
  domain_comment: "Internal DNS HostedZone for the cloud cluster",
  public_hosted_zone: "Z016942938TFLEH1J2FS1",
};

// VPC Setup and Networking
export const network = {
  // VPC Cidr Block Definition
  vpc: {
    name: "homelab-vpc",
    cidr_block: "172.29.0.0/19",
  },
  // Subnet Definitions
  subnets: {
    public: [
      {
        name: "public1a",
        cidr_block: "172.29.0.0/23",
        az: "a",
      },
      {
        name: "public1b",
        cidr_block: "172.29.2.0/23",
        az: "b",
      },
    ],
    private: [
      {
        name: "private1a",
        cidr_block: "172.29.8.0/21",
        az: "a",
      },
      {
        name: "private1b",
        cidr_block: "172.29.16.0/21",
        az: "b",
      },
    ],
  },
};

// Compute Values
export const compute: {
  control_plane_nodes: Node[];
  worker_nodes: Node[];
  bastion: Node[];
} = {
  control_plane_nodes: [
    {
      name: "kube-control-1",
      instance_size: "t4g.medium",
      arch: "arm64",
      subnet_name: "private1a",
      root_volume_size: 60,
      root_volume_type: "gp3",
      privateIp: "172.29.8.5",
    },
    {
      name: "kube-worker-1",
      instance_size: "t3.medium",
      arch: "amd64",
      subnet_name: "private1a",
      root_volume_size: 60,
      root_volume_type: "gp3",
      privateIp: "172.29.8.100",
    },
  ],
  worker_nodes: [],
  bastion: [
    {
      name: "bastion",
      // name: "kube-worker-2",
      instance_size: "t3.micro",
      arch: "amd64",
      subnet_name: "public1a",
      root_volume_size: 40,
      root_volume_type: "gp3",
      privateIp: "172.29.0.101",
    },
  ],
};

// AMIs
export const amis: {
  [region: string]: {
    masters_amd64: string;
    masters_arm64: string;
    workers_amd64?: string; // Optional; only if you're using x64 instances
    workers_arm64?: string; // Optional; only if you're using t4g instances
    bastion_amd64?: string; // Optional; only if you're using x64 instances
    bastion_arm64?: string; // Optional; only if you're using x64 instances
  };
} = {
  "us-east-1": {
    // amd64 / 64-Bit Intel/AMD Architecture
    // https://cloud-images.ubuntu.com/locator/ec2/ - Ubuntu Image locator; search "us-east-1 22.04"
    // masters_amd64: "ami-00874d747dde814fa", // Ubuntu 22.04, Release 2023.01.15
    // workers_amd64: "ami-00874d747dde814fa", // Ubuntu 22.04, Release 2023.01.15
    // arm64 / 64-Bit ARM Architecture
    // masters_arm64: "ami-01625be155ee390e9", // Ubuntu 22.04, Release 2023.01.15
    // workers_arm64: "ami-01625be155ee390e9", // Ubuntu 22.04, Release 2023.01.15
    // Bastion
    bastion_amd64: "ami-0a5f04cdf7758e9f0", // Ubuntu Linux 22.04
    // https://cloud-images.ubuntu.com/locator/ec2/, search '22.04 us-east-1'
    // Talos AMIs; deprecated for now
    masters_amd64: "ami-062baea4d084b34f2", // v1.3.2
    workers_amd64: "ami-062baea4d084b34f2", // v1.3.2
    // // arm64 / 64-Bit ARM Architecture
    masters_arm64: "ami-03d44da5afcc12821", // v1.5.5
    workers_arm64: "ami-03d44da5afcc12821", // v1.5.5
  },
};

// Security Groups
export const security_groups = {
  talos_configuration: {
    name: "talos_configuration",
    description: "Security Group for Talos Configuration",
    ingress: [
      {
        description: "Talos - talosctl",
        port: 50000,
        protocol: "tcp",
        cidr_blocks: ["0.0.0.0/0"],
      },
      {
        description: "Talos - Control plane nodes, worker nodes",
        port: 50001,
        protocol: "tcp",
        cidr_blocks: ["0.0.0.0/0"],
      },
    ],
    egress: [
      {
        description: "Talos - talosctl",
        port: -1,
        protocol: "all",
        cidr_blocks: ["0.0.0.0/0"],
      },
    ],
  },
  nlb_ingress: {
    name: "nlb_inbound_traffic",
    description: "Permitted inbound traffic",
    ingress: [
      {
        description: "ICMP Inbound",
        port: -1,
        protocol: "icmp",
        cidr_blocks: ["0.0.0.0/0"],
      },
      {
        description: "SSH Inbound",
        port: 22,
        protocol: "tcp",
        cidr_blocks: ["0.0.0.0/0"],
      },
      {
        description: "HTTP Inbound",
        port: 80,
        protocol: "tcp",
        cidr_blocks: ["0.0.0.0/0"],
      },
      {
        description: "HTTPS Inbound",
        port: 443,
        protocol: "tcp",
        cidr_blocks: ["0.0.0.0/0"],
      },
    ],
    egress: [
      {
        description: "Internet",
        port: -1,
        protocol: "all",
        cidr_blocks: ["0.0.0.0/0"],
      },
    ],
  },
  bastion: {
    name: "bastion",
    description: "Permitted inbound traffic",
    ingress: [
      {
        description: "ICMP Inbound",
        port: -1,
        protocol: "icmp",
        cidr_blocks: ["0.0.0.0/0"],
      },
      {
        description: "SSH Inbound",
        port: 22,
        protocol: "tcp",
        cidr_blocks: ["0.0.0.0/0"],
      },
    ],
    egress: [
      {
        description: "Internet",
        port: -1,
        protocol: "all",
        cidr_blocks: ["0.0.0.0/0"],
      },
    ],
  },
};

// Global Tags
export const tags = {
  environment: "homelab",
  project_name: "cloud-homelab",
  repo_name: "homelab-kube-cluster",
  github_url: "https://github.com/danmanners/homelab-kube-cluster",
};

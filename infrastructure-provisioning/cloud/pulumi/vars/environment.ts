import { Node } from "../types/types"

// Cloud Setup Values
export const cloud_auth = {
  aws_region: "us-east-1",
  aws_profile: "default"
}

export const user_data = `
#cloud-config
users:
  - name: dan
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBvwr0v1C32Xc72AqJexn0fEsESblReaGEPLeTs/Fa5i DM Fedora Desktop
`

export const general = {
  domain: "cloud.danmanners.com",
  domain_comment: "Internal DNS HostedZone for the cloud cluster"
}

// VPC Setup and Networking
export const network = {
  // VPC Cidr Block Definition
  vpc: {
    name: "homelab-vpc",
    cidr_block: "172.29.0.0/20"
  },
  // Subnet Definitions
  subnets: {
    public: [
      {
        name: "public1a",
        cidr_block: "172.29.0.0/23",
        az: "a",
        privateIP: "172.29.0.5",
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
        cidr_block: "172.29.14.0/23",
        az: "a",
      },
      {
        name: "private1b",
        cidr_block: "172.29.12.0/23",
        az: "b",
      },
    ]
  }
}

// Compute Values
export const compute: {
  control_planes: Node[],
  workers: Node[],
  bastion: Node[]
} = {
  control_planes: [
    {
      name: "talos-control-1",
      instance_size: "t4g.small",
      subnet_name: "private1a",
      root_volume_size: 20,
      root_volume_type: "gp3",
      privateIp: "172.29.14.5"
    },
  ],
  workers: [
    {
      name: "talos-worker-1",
      instance_size: "t3.small",
      subnet_name: "private1a",
      root_volume_size: 32,
      root_volume_type: "gp3",
    },
    {
      name: "talos-worker-2",
      instance_size: "t3.small",
      subnet_name: "private1b",
      root_volume_size: 32,
      root_volume_type: "gp3",
    },
  ],
  bastion: [ // Used exclusively for troubleshooting
    {
      name: "bastion",
      instance_size: "t3.micro",
      subnet_name: "public1a",
      root_volume_size: 8,
      root_volume_type: "gp3",
    }
  ]
}

// AMIs
export const amis: {
  [region: string]: {
    masters_amd64: string,
    masters_arm64: string,
    workers_amd64?: string, // Optional; only if you're using t4g instances
    workers_arm64?: string, // Optional; only if you're using t4g instances
    bastion_amd64?: string,
  }
} = {
  "us-east-1": {
    // amd64 / 64-Bit Intel/AMD Architecture
    // https://cloud-images.ubuntu.com/locator/ec2/ - Ubuntu Image locator; search "us-east-1 22.04"
    masters_amd64: "ami-00874d747dde814fa", // Ubuntu 22.04, Release 2023.01.15
    workers_amd64: "ami-00874d747dde814fa", // Ubuntu 22.04, Release 2023.01.15
    // arm64 / 64-Bit ARM Architecture
    masters_arm64: "ami-01625be155ee390e9", // Ubuntu 22.04, Release 2023.01.15
    workers_arm64: "ami-01625be155ee390e9", // Ubuntu 22.04, Release 2023.01.15
    // Talos AMIs; deprecated for now
    // masters_amd64: "ami-076bd4ef7fee6bf8a", // v1.3.1
    // workers_amd64: "ami-076bd4ef7fee6bf8a", // v1.3.1
    // // arm64 / 64-Bit ARM Architecture
    // masters_arm64: "ami-08310095e5e03008e", // v1.3.1
    // workers_arm64: "ami-08310095e5e03008e", // v1.3.1
    // Bastion
    bastion_amd64: "ami-023fb534213ca41da", // Amazon Linux 2 ARM64
  }
}

// Security Groups
export const security_groups = {
  bastion: {
    name: "bastion_ingress",
    description: "Inbound traffic for the Bastion",
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
    ]
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
      {
        description: "Netmaker Ingress",
        port_start: 51821,
        port_end: 51830,
        protocol: "udp",
        cidr_blocks: ["0.0.0.0/0"],
      },
      {
        description: "All Inbound from Internal Traffic, Wireguard, and On-Prem Networking.",
        port: -1,
        protocol: "all",
        cidr_blocks: ["10.4.0.0/23", network.vpc.cidr_block],
      },
    ],
    egress: [
      {
        description: "Internet",
        port: -1,
        protocol: "all",
        cidr_blocks: ["0.0.0.0/0"],
      },
    ]
  }
}

// Global Tags
export const tags = {
  environment: "homelab",
  project_name: "talos-homelab-cloud",
}

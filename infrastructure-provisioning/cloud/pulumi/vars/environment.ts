export const cloud_auth = {
  "aws_region": "us-east-1",
  "aws_profile": "default"
}

export const network = {
  // VPC Cidr Block Definition
  "vpc": {
    "cidr_block": "172.29.0.0/20"
  },
  // Subnet Definitions
  "subnets": {
    "public": [
      {
        "name": "public1a",
        "cidr_block": "172.29.0.0/23",
      },
      {
        "name": "public1b",
        "cidr_block": "172.29.2.0/23",
      },
    ],
    "private": [
      {
        "name": "private1a",
        "cidr_block": "172.29.14.0/23",
      },
      {
        "name": "private1b",
        "cidr_block": "172.29.12.0/23",
      },
    ]
  }
}

// Compute
export const compute = {
  "control_planes": [
    {
      "name": "k3s-control-1",
      "instance_size": "t4g.small",
      "subnet_id": "private1a",
      "root_volume_size": 16,
    },
  ],
  "workers": [
    {
      "name": "k3s-worker-1",
      "instance_size": "t3.small",
      "subnet_id": "private1a",
      "root_volume_size": 32,
    },
    {
      "name": "k3s-worker-2",
      "instance_size": "t3.small",
      "subnet_id": "private1a",
      "root_volume_size": 32,
    }
  ]
}

// Security Groups
export const security_groups = {
  "nlb_ingress": {
    "name": "nlb_inbound_traffic",
    "description": "Permitted inbound traffic",
    "ingress": [
      {
        "description": "ICMP Inbound",
        "port": -1,
        "protocol": "icmp",
        "cidr_block": "0.0.0.0/0",
      },
      {
        "description": "SSH Inbound",
        "port": 22,
        "protocol": "tcp",
        "cidr_block": "0.0.0.0/0",
      },
      {
        "description": "HTTP Inbound",
        "port": 80,
        "protocol": "tcp",
        "cidr_block": "0.0.0.0/0",
      },
      {
        "description": "HTTPS Inbound",
        "port": 443,
        "protocol": "tcp",
        "cidr_block": "0.0.0.0/0",
      },
      {
        "description": "Netmaker Ingress",
        "port_start": 51821,
        "port_end": 51830,
        "protocol": "udp",
        "cidr_block": "0.0.0.0/0",
      },
    ]
  }

}

// Global Tags
export const tags = {
  "environment": "homelab",
  "project_name": "k3s-homelab-cloud",
}

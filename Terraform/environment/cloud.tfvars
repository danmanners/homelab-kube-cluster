google_cloud_auth = {
  // Google Cloud
  google_project_id     = "booming-tooling-291422"
  google_project_region = "us-east4"
}

ssh_auth = {
  username  = "danmanners"
  pubkey    = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAngYLcPg5iIOgxoVae6JUr3gyqB4QBufth6oNc+II0D Dan Manners <daniel.a.manners@gmail.com>"
}

digitalocean = {
  droplets = [
    {
      name    = "tpi-k3s-do-edge-1"
      image   = "ubuntu-20-04-x64"
      region  = "nyc3"
      size    = "s-2vcpu-4gb" // $20 per-month
    }
  ]
  // Firewall Settings
  firewall = {
    "k3s_public_ingress" = {
      name = "k3s-public-ingress"
      inbound_rules = [
        {
          protocol          = "tcp"
          port_range        = "22"
          source_addresses  = ["0.0.0.0/0","::/0"]
        },
        {
          protocol          = "tcp"
          port_range        = "80"
          source_addresses  = ["0.0.0.0/0","::/0"]
        },
        {
          protocol          = "tcp"
          port_range        = "443"
          source_addresses  = ["0.0.0.0/0","::/0"]
        },
        {
          protocol          = "tcp"
          port_range        = "2222"
          source_addresses  = ["0.0.0.0/0","::/0"]
        },
        {
          protocol          = "tcp"
          port_range        = "8443"
          source_addresses  = ["0.0.0.0/0","::/0"]
        },
        {
          protocol          = "tcp"
          port_range        = "31693"
          source_addresses  = ["0.0.0.0/0","::/0"]
        },
        {
          protocol          = "tcp"
          port_range        = "30484"
          source_addresses  = ["0.0.0.0/0","::/0"]
        },
        {
          protocol          = "icmp"
          port_range        = null
          source_addresses  = ["0.0.0.0/0","::/0"]
        }
      ]
      outbound_rules = [
        {
          protocol              = "tcp"
          port_range            = "1-65535"
          destination_addresses = ["0.0.0.0/0","::/0"]
        },
        {
          protocol              = "udp"
          port_range            = "1-65535"
          destination_addresses = ["0.0.0.0/0","::/0"]
        },
        {
          protocol              = "icmp"
          port_range            = null
          destination_addresses = ["0.0.0.0/0","::/0"]
        }
      ]
    }
  }
}

google_cloud = {
  "vpc_name" = "homelab-k3s"
  "vpc_public_subnets" = {
    "homelab-public-1a" = {
      ip_cidr_range = "10.46.0.0/23"
      description   = "Public facing subnet; first region."
    }
  },
  ingress_rules = {
    name = "k3s-ingress"
    direction = "ingress"
    target_tags = ["k3s"]
    allow_blocks = {
      icmp = {
        protocol = "icmp"
      }
      tcp = {
        protocol = "tcp"
        ports = ["22","80","443","2222","8443"]
      }
    }
  },
  compute = [
    {
      "name"            = "tpi-k3s-gcp-edge"
      "zone"            = "a"
      "vm_type"         = "e2-small"
      "boot_disk_size"  = 20
      "host_os"         = "ubuntu-os-cloud/ubuntu-2004-lts"
      "network"         = {
        "subnetwork"    = "projects/booming-tooling-291422/regions/us-east4/subnetworks/homelab-public-1a"
        "tier"          = "standard"
      }
      "tags"            = ["k3s"]
    }
  ] 
}

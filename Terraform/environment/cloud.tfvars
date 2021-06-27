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
//    },
//    {
//      name    = "tpi-k3s-do-edge-2"
//      image   = "ubuntu-20-04-x64"
//      region  = "nyc3"
//      size    = "s-1vcpu-2gb"       // $10 per-month
//    }
  ]

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

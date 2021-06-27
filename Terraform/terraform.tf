terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  backend "gcs" {
    bucket  = "dm-homelab-tfstate"
    prefix  = "do/state"
  }
}

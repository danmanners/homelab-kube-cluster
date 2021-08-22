#########################################################################
### SSH PubKeys

# module "ssh_pubkey" {
#   // Module Source
#   source = "./modules/digital_ocean/add_ssh_pubkey"
#   ssh_pubkey = var.ssh_auth.pubkey
# }

#########################################################################
### Virtual Machines

// Create the DigitalOcean Droplets
# module "droplets" {
#   // Module Source
#   source      = "./modules/digital_ocean/create_droplets"
#   droplets    = var.digitalocean.droplets
#   pubkey_ids  = toset([module.ssh_pubkey.pubkey_id])

#   // SSH Information
#   ssh_username  = var.ssh_auth.username
#   ssh_pubkey    = var.ssh_auth.pubkey

#   // Depends On
#   depends_on = [
#     module.ssh_pubkey
#   ]
# }

#########################################################################
### Firewalls

// Create the firewalls for the Digital Ocean droplets and associate them
# module "droplet_firewalls" {
#   // Module Source
#   source          = "./modules/digital_ocean/create_firewall"

#   // Variables
#   name            = var.digitalocean.firewall.k3s_public_ingress.name
#   droplet_ids     = module.droplets.ids
#   inbound_rules   = var.digitalocean.firewall.k3s_public_ingress.inbound_rules
#   outbound_rules  = var.digitalocean.firewall.k3s_public_ingress.outbound_rules
#   // Depends On
#   depends_on = [
#     module.droplets
#   ]
# }

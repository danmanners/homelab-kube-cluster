// Create a Droplet for each of the droplets specified
resource "digitalocean_droplet" "node" {
  // Loop through each of the droplet settings
  for_each = { for droplet in var.droplets: droplet.name => droplet }

  name   = each.value.name
  image  = each.value.image
  region = each.value.region
  size   = each.value.size

  user_data = templatefile("${path.module}/user_data.tpl", { ssh_users = local.ssh_users })

  // Set of Public Key IDs
  ssh_keys = var.pubkey_ids
}

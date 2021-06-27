// Create a new SSH key
resource "digitalocean_ssh_key" "default" {
  name       = "Dan Ryzen PC"
  public_key = var.ssh_pubkey
}

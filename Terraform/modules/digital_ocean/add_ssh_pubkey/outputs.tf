// Output the Public Key ID
output "pubkey_id" {
  value = digitalocean_ssh_key.default.id
}
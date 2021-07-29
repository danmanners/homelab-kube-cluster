// Print the DigitalOcean Droplet Public IPs
output "digitalocean_droplet_ips" {
  value = module.droplets.ipv4
}

output "aws_cloud_ips" {
  value = module.aws_compute.ipv4
}

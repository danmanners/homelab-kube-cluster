// Print the DigitalOcean Droplet Public IPs
output "digitalocean_droplet_ips" {
  value = module.droplets.ipv4
}

// Print the Google Cloud Compute Public IPs
output "google_cloud_ips" {
  value = module.google_cloud_compute.ipv4
}

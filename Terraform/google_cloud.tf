// Google Cloud Settings
variable "google_cloud" {
  description = "All Google Cloud specific resource values should be loaded in this top-level map."
}

// Create the Google Cloud Networking
module "google_cloud_networking" {
  // Module Source
  source                = "git::https://github.com/danmanners/GCP-Learning.git//Single-Node-Multi-Provider/modules/google_cloud/vpc"

  // Google Project Information
  google_project_id     = var.google_cloud_auth.google_project_id
  google_project_region = var.google_cloud_auth.google_project_region

  // Networking Settings
  vpc_name              = var.google_cloud.vpc_name
  vpc_public_subnets    = var.google_cloud.vpc_public_subnets
}

// Create the Google Cloud Firewall
module "google_cloud_fw_ingress" {
  // Module Source
  source                = "git::https://github.com/danmanners/GCP-Learning.git//Single-Node-Multi-Provider/modules/google_cloud/firewall"

  // Google Project Information
  google_project_id     = var.google_cloud_auth.google_project_id
  google_project_region = var.google_cloud_auth.google_project_region

  // Firewall Settings
  name = var.google_cloud.ingress_rules.name
  network = module.google_cloud_networking.vpc_name
  direction = var.google_cloud.ingress_rules.direction
  target_tags = var.google_cloud.ingress_rules.target_tags

  // Allow Blocks
  allow_blocks = var.google_cloud.ingress_rules.allow_blocks
}

// Create the Google Cloud compute instances
module "google_cloud_compute" {
  // Module Source
  source                = "git::https://github.com/danmanners/GCP-Learning.git//Single-Node-Multi-Provider/modules/google_cloud/compute"

  // Google Project Information
  google_project_id     = var.google_cloud_auth.google_project_id
  google_project_region = var.google_cloud_auth.google_project_region

  // Compute Resources
  compute_nodes         = var.google_cloud.compute
  ssh_username          = var.ssh_auth.username
  ssh_pubkey            = var.ssh_auth.pubkey

  // The Virtual Machines cannot be created until the networking is available.
  depends_on = [
    module.google_cloud_networking
  ]
}

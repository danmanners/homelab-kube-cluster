variable "name" {
  description = "Name of the firewall rule."
}

// List of droplet IDs to associate the firewall to.
variable "droplet_ids" {
  description = "List of droplet IDs to associate."
}

// Map of ports, protocols, and sources to allow inbound [OPTIONAL]
variable "inbound_rules" {
  description = "List of objects containing ports, protocols, and sources for inbound traffic."
  default = {}
}

// Map of ports, protocols, and sources to allow outbound [OPTIONAL]
variable "outbound_rules" {
  description = "List of objects containing ports, protocols, and sources for outbound traffic."
  default = {}
}
resource "digitalocean_firewall" "web" {
  name        = var.name
  droplet_ids = toset([ for key,value in var.droplet_ids : value ])

  dynamic "inbound_rule" {
    for_each = var.inbound_rules
    content {
      protocol          = inbound_rule.value.protocol
      port_range        = inbound_rule.value.port_range
      source_addresses  = inbound_rule.value.source_addresses
    }
  }

  dynamic "outbound_rule" {
    for_each = var.outbound_rules
    content {
      protocol              = outbound_rule.value.protocol
      port_range            = outbound_rule.value.port_range
      destination_addresses = outbound_rule.value.destination_addresses
    }
  }
}
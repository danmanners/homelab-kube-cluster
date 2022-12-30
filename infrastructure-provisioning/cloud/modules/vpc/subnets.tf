resource "aws_subnet" "public" {
  // Loop through 
  for_each = {
    for subnet in var.subnets.public : subnet.name => subnet
  }

  // Public CIDR Setup
  vpc_id                  = aws_vpc.primary.id
  cidr_block              = each.value.cidr_block
  map_public_ip_on_launch = true

  // Tags
  tags = var.tags
}

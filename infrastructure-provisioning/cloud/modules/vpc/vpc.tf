// Create the VPC
resource "aws_vpc" "primary" {
  cidr_block = var.cidr_block
  tags       = var.tags
}

// Create the VPC
resource "aws_vpc" "primary" {
  cidr_block = var.vpc_cidr_block
  tags       = var.tags
}

// Deploy the Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.primary.id

  tags = var.tags
  depends_on = [
    aws_vpc.primary
  ]
}

// Deploy the NAT Gateway
resource "aws_nat_gateway" "ngw" {
  subnet_id = aws_subnet.public["test"].id
  tags      = var.tags

  depends_on = [
    aws_internet_gateway.gw
  ]
}

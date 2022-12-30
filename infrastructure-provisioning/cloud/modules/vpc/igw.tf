resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.primary.id
  tags   = var.tags
}

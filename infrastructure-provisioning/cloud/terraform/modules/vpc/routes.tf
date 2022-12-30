resource "aws_route_table" "public" {
  for_each = {
    for subnet in aws_subnet.public : "values" => subnet.id ...
  }

  vpc_id = aws_vpc.primary.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = var.tags
  depends_on = [
    aws_subnet.public,
    aws_internet_gateway.gw
  ]
}

resource "aws_route_table" "private" {
  for_each = {
    for subnet in aws_subnet.private : "values" => subnet.id ...
  }

  vpc_id = aws_vpc.primary.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.ngw.id
  }

  tags = var.tags
  depends_on = [
    aws_subnet.private,
    aws_nat_gateway.ngw
  ]
}

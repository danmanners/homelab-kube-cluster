resource "aws_route" "primary_outbound_route" {
  route_table_id         = aws_vpc.primary.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id

  depends_on = [
    aws_vpc.primary
  ]
}

resource "aws_route_table_association" "public" {
  //
  for_each = zipmap(
    [for k, v in aws_subnet.public : v.id],
    [for k, v in aws_route_table.public : v.id]
  )

  subnet_id      = each.key
  route_table_id = each.value
}

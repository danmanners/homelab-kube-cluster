output "vpc_id" {
  value = aws_vpc.primary.id
}

output "public_subnets" {
  value = {
    for k, v in aws_subnet.public : k => v.id
  }
}
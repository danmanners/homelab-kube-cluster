resource "aws_subnet" "public" {
  // Loop through 
  for_each = {
    for k,v in var.public_subnets : k => v
  }

  // Public CIDR Setup
  vpc_id                  = aws_vpc.primary.id
  cidr_block              = each.value.cidr_block
  map_public_ip_on_launch = true

  // Tags
  tags = merge(
    var.tags,
    {
      "kubernetes.io/role/elb" = 1
    }
    // Ensure that the AWS Load Balancer Controller can
    // identify the public subnet for load balancing
  )
}

resource "aws_subnet" "private" {
  // Loop through 
  for_each = {
    for k,v in var.private_subnets : k => v
  }

  // Private CIDR Setup
  vpc_id                   = aws_vpc.primary.id
  cidr_block               = each.value.cidr_block

  // Tags
  tags = var.tags
}

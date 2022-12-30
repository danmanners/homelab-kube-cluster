module "aws_vpc" {
  source = "../modules/vpc"

  vpc_cidr_block  = var.network.vpc.cidr_block
  public_subnets  = var.network.subnets.public
  private_subnets = var.network.subnets.private
  tags            = var.tags
}

variable "vpc_cidr_block" {
  description = "Primary VPC CIDR Block for the Network"
  type        = string
  default     = "172.16.0.0/20"
}

variable "public_subnets" {
  description = "Map of Public Subnets"
}

variable "private_subnets" {
  description = "Map of Private Subnets"
}

variable "tags" {
  description = "Tags to be associated with all resources"
  type        = map(string)
}

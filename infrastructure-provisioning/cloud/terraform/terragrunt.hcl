generate "provider" {
  path = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents = <<EOF
provider "aws" {
  // Ensure that you've set up your ~/.aws/credentials.conf file.
  // Set the region and profile name here.
  region  = var.cloud_auth.aws_region
  profile = var.cloud_auth.aws_profile
}
EOF
}

generate "backend" {
  path      = "backend.tf"
  if_exists = "overwrite_terragrunt"
  contents = <<EOF
terraform {
  backend "s3" {
    config = {
      region         = "us-east-1"
      bucket         = "danmanners-tfstate"
      key            = "state/${basename(get_terragrunt_dir())}.tfstate"
      encrypt        = true
      dynamodb_table = "tfstate-lock"
    }
  }
}
EOF
}

generate "inputs" {
  path = "inputs.tf"
  if_exists = "overwrite_terragrunt"
  contents = <<EOF
variable "cloud_auth" {}
variable "compute" {}
variable "security_groups" {}

variable "network" {}

variable "tags" {
  type = map(string)
}
EOF
}

terraform {
  extra_arguments "common_var" {
    commands = [
      "init",
      "apply",
      "plan",
      "import",
      "push",
      "refresh",
      "console"
    ]

    arguments = [
      "-var-file=${get_parent_terragrunt_dir()}/environment/aws.tfvars",
    ]
  }
}

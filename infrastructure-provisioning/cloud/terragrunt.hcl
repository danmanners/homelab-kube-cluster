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
      "-var-file=${get_terragrunt_dir()}/environment/aws.tfvars",
    #   "-var-file=${get_terragrunt_dir()}/${path_relative_from_include()}/../environment/aws.tfvars",
    ]
  }
}

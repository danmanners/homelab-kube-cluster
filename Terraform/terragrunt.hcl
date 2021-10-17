terraform {
    extra_arguments "common_var" {
        commands = [
            "init",
            "apply",
            "plan",
            "import",
            "push",
            "refresh"
        ]

        arguments = [
            "-var-file=${get_terragrunt_dir()}/${path_relative_from_include()}/environment/cloud.tfvars",
        ]
    }
}

// Environment Variable Imports
import * as config from "./vars/environment"

// Function Imports
import { createK3sWorkers } from "./utils/k3sWorkers"
import { vpcProvision } from "./utils/vpc"

const networking = vpcProvision(
  config.cloud_auth.aws_region,
  config.network.vpc,
  config.network.subnets.public,
  config.network.subnets.private,
  config.tags
)

// const k3sWorkers = createK3sWorkers(
//   config.compute.workers,
//   config.tags,
//   networking
// )

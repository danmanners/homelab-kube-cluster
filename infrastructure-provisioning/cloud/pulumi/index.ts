// Pulumi Functions
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";


// Environment Variable Imports
import * as config from "./vars/environment"

// Function Imports
import { createK3sWorkers } from "./utils/k3sWorkers"
import { vpcProvision } from "./utils/vpc"

const networking = vpcProvision(
  config.network.vpc,
  config.network.subnets.public,
  config.network.subnets.private,
  config.tags
)

// createK3sWorkers(
//   config.compute.workers,
//   config.tags
// )

// Create K3s Workers

// // Export the name of the bucket
// export { networking }

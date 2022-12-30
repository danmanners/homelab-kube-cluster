import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as config from "./vars/environment"
import { InstanceType } from "@pulumi/aws/ec2";
// Imports
import { createK3sWorkers } from "./utils/k3sWorkers"

const vpc = new aws.ec2.Vpc("primary", {
  cidrBlock: config.network.vpc.cidr_block,
  tags: config.tags
})

// Subnets
const publicSubnets = []
for (const subnet of config.network.subnets.public) {
  const s = new aws.ec2.Subnet(subnet.name, {
    vpcId: vpc.id,
    cidrBlock: subnet.cidr_block
  })
  publicSubnets.push({ "name": subnet.name, "id": s.id })
}

// Create K3s Workers
const workers = createK3sWorkers(publicSubnets)

// // Export the name of the bucket
export { createK3sWorkers }

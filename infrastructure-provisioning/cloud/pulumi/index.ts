import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as config from "./vars/environment"
import { getUbuntuAmi } from "./utils/getAmi"
import { InstanceType } from "@pulumi/aws/ec2";

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
  publicSubnets.push({"name": subnet.name, "id": s.id})
}

// Provision a K3s worker
const k3sworkers = []

for (const node of config.compute.workers) {
  const s = new aws.ec2.Instance(node.name,{
    ami: getUbuntuAmi().then(ubuntu => ubuntu.id),
    instanceType: node.instance_size,
    rootBlockDevice: {
      volumeSize: node.root_volume_size,
    },
    tags: config.tags,
  })
}

// // Export the name of the bucket
// export { publicSubnets }

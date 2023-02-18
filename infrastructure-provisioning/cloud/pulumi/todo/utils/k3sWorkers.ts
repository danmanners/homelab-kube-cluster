import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"
import { getUbuntuAmi } from "./getAmi"
import { Node, NetworkingPreview } from "../types/types"

// Provision a K3s worker
export function createK3sWorkers(
  compute: Node[],
  tags: { [key: string]: any },
  networking: NetworkingPreview): {
    name: string, privateIP: pulumi.Output<string>
  }[] {
  // Create the K3s object array
  const k3sworkers = []
  for (const node of compute) {
    // Check for the subnetId
    let subnetId: pulumi.Input<string> | undefined

    // Check if we're doing private subnets
    if (networking.private_subnets[node.subnet_name] !== undefined) {
      subnetId = networking.private_subnets[node.subnet_name].id
    }
    // Check if we're doing public subnets
    if (networking.public_subnets[node.subnet_name] !== undefined) {
      subnetId = networking.public_subnets[node.subnet_name].id
    }
    // If subnetId isn't definied, throw an error and die
    if (subnetId == undefined) {
      throw new Error("shouldn't happen")
    }

  // Create a K3s Workers for each 
  const s = new aws.ec2.Instance(node.name, {
      ami: getUbuntuAmi().then(ubuntu => ubuntu.id),
      instanceType: node.instance_size,
      subnetId: subnetId,
      rootBlockDevice: {
        volumeSize: node.root_volume_size,
      },
      tags: Object.assign({},
        tags,
        { "Name": node.name }
      )
    })
    // Add each node to the K3s array
    k3sworkers.push({ name: node.name, privateIP: s.privateIp })
  }
  // Return the final object back
  return k3sworkers
}
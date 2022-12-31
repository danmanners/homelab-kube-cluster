import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { getUbuntuAmi } from "./getAmi"
import {Node, NetworkingPreview} from "../types/types"

// Provision a K3s worker
export function createK3sWorkers(
  compute: Node[],
  tags: { [key: string]: any },
  networking: NetworkingPreview): { name: string, privateIP: pulumi.Output<string>
}[] {
  // Create the K3s final array
  const k3sworkers = []
  // Create the K3s Workers
  for (const node of compute) {
    // const v = aws.ec2.getSubnet({
    //   filters: [{
    //     name: "tag:Name",
    //     values: [node.subnet_name]
    //   }]
    // })
    // Check for the subnetId
    let subnetId: pulumi.Input<string> | undefined

    if (networking.private_subnets[node.subnet_name] !== undefined) {
      subnetId = networking.private_subnets[node.subnet_name].id
    }
  
    if (networking.public_subnets[node.subnet_name] !== undefined) {
      subnetId = networking.public_subnets[node.subnet_name].id
    }

    if (subnetId == undefined) {
      throw new Error("shouldn't happen")
    }


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
  // Return the final object
  return k3sworkers
}
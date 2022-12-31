import * as aws from "@pulumi/aws";
import { getUbuntuAmi } from "./getAmi"

// Provision a K3s worker
export function createK3sWorkers(
  compute: any[],
  tags: { [key: string]: any }) {
  // Create the K3s final array
  const k3sworkers = []
  // Create the K3s Workers
  for (const node of compute) {
    const v = aws.ec2.getSubnet({
      filters: [{
        name: "tag:Name",
        values: [node.subnet_name]
      }]
    })
    const s = new aws.ec2.Instance(node.name, {
      ami: getUbuntuAmi().then(ubuntu => ubuntu.id),
      instanceType: node.instance_size,
      subnetId: v.then(v => v.id),
      rootBlockDevice: {
        volumeSize: node.root_volume_size,
      },
      tags: tags,
    })
    // Add each node to the K3s array
    k3sworkers.push({ "name": node.name, "privateIP": s.privateIp })
  }
  // Return the final object
  return k3sworkers
}
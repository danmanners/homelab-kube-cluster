import * as aws from "@pulumi/aws";
import * as config from "../vars/environment"
import { getUbuntuAmi } from "./getAmi"

// Provision a K3s worker
export async function createK3sWorkers(subnetIds: any[]) {
  const k3sworkers = []
  for (const node of config.compute.workers) {
    const v = subnetIds.filter((obj) => { return obj.name == node.subnet_name })[0]
    const s = new aws.ec2.Instance(node.name, {
      ami: getUbuntuAmi().then(ubuntu => ubuntu.id),
      instanceType: node.instance_size,
      subnetId: v.id,
      rootBlockDevice: {
        volumeSize: node.root_volume_size,
      },
      tags: config.tags,
    })
    k3sworkers.push({ "name": node.name, "privateIP": s.privateIp })
  }
  return k3sworkers
}
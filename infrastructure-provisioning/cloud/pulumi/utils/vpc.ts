import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { NetworkingPreview } from "../types/types"

// Provision the VPC and associated resources
export function vpcProvision(
  region: string,
  vpc: { [key: string]: any },
  publicSubnets: any[],
  privateSubnets: any[],
  tags: { [key: string]: any }): NetworkingPreview {
  // Provision the VPC itself
  const network_output: any = {}
  const vpc_setup = new aws.ec2.Vpc("primary", {
    cidrBlock: vpc.cidr_block,
    tags: Object.assign({},
      tags,
      { "Name": vpc.name }
    )
  })

  // Create Public Subnets
  const pubSubnets: { [name: string]: { id: pulumi.Output<string> } } = {}
  for (const subnet of publicSubnets) {
    const s = new aws.ec2.Subnet(subnet.name, {
      vpcId: vpc_setup.id,
      cidrBlock: subnet.cidr_block,
      availabilityZone: region + subnet.az,
      mapPublicIpOnLaunch: true,
      tags: Object.assign({},
        tags,
        { "Name": subnet.name }
      )
    })
    pubSubnets[subnet.name] = { id: s.id }
    //pubSubnets.push({ "name": subnet.name, "id": s.id })
  }

  // Create Private Subnets
  const privSubnets: { [name: string]: { id: pulumi.Output<string> } } = {}
  for (const subnet of privateSubnets) {
    const s = new aws.ec2.Subnet(subnet.name, {
      vpcId: vpc_setup.id,
      cidrBlock: subnet.cidr_block,
      availabilityZone: region + subnet.az,
      tags: Object.assign({},
        tags,
        { "Name": subnet.name }
      )
    })
    privSubnets[subnet.name] = { id: s.id }
  }

  // Build the return output
  network_output['vpc'] = { arn: vpc.arn, id: vpc.id, name: vpc.name }
  network_output['public_subnets'] = pubSubnets
  network_output['private_subnets'] = privSubnets

  // Return the output
  return network_output
}

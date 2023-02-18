import * as pulumi from "@pulumi/pulumi"
import * as aws from "@pulumi/aws"
import { NetworkingPreview } from "../types/types"
import { network } from "../vars/environment"

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

  // Internet Gateway
  const gw = new aws.ec2.InternetGateway("gw", {
    vpcId: vpc_setup.id,
    tags: Object.assign({},
      tags, { "Name": vpc.name + "-igw" }
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
  network_output['vpc'] = {
    name: vpc.name,
    arn: vpc.arn,
    id: vpc.id,
  }
  network_output['public_subnets'] = pubSubnets
  network_output['private_subnets'] = privSubnets

  // Elastic IP for the NAT Gateway
  const natgw_eip = new aws.ec2.Eip("natgw", {
    vpc: true,
    tags: Object.assign({},
      tags, { "Name": vpc.name + "-igw-eip" }
    )
  })

  // NAT Gateway
  const natgw = new aws.ec2.NatGateway("natgw", {
    allocationId: natgw_eip.id,
    subnetId: network_output,
    tags: Object.assign({},
      tags, { "Name": vpc.name + "-ngw" }
    )
  })

  // Public Subnet Route Tables
  // Private Subnet Route Tables
  // Public Subnet Routes
  // Private Subnet Routes
  // Public Subnet Route Table Associations
  // Private Subnet Route Table Associations

  // Return the output
  return network_output
}

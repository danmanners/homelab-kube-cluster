import * as aws from "@pulumi/aws";

// Provision the VPC and associated resources
export function vpcProvision(
  vpc: { [key: string]: any },
  publicSubnets: any[],
  privateSubnets: any[],
  tags: { [key: string]: any }) {
  // Provision the VPC itself
  const network_output: any = {}
  const current = aws.getRegion({});
  // const network_output: { [key: string]: any } = {}
  const vpc_setup = new aws.ec2.Vpc("primary", {
    cidrBlock: vpc.cidr_block,
    tags: Object.assign({},
      tags,
      { "Name": vpc.name }
    )
  })

  // Create Public Subnets
  const pubSubnets = []
  for (const subnet of publicSubnets) {
    const c = current.then(current => current.name)
    const s = new aws.ec2.Subnet(subnet.name, {
      vpcId: vpc_setup.id,
      cidrBlock: subnet.cidr_block,
      availabilityZone: c + subnet.az,
      mapPublicIpOnLaunch: true,
      tags: Object.assign({},
        tags,
        { "Name": subnet.name }
      )
    })
    pubSubnets.push({ "name": subnet.name, "id": s.id })
  }

  // Create Private Subnets
  const privSubnets = []
  for (const subnet of privateSubnets) {
    const c = current.then(current => current.name)
    const s = new aws.ec2.Subnet(subnet.name, {
      vpcId: vpc_setup.id,
      cidrBlock: subnet.cidr_block,
      availabilityZone: c + subnet.az,
      tags: Object.assign({},
        tags,
        { "Name": subnet.name }
      )
    })
    privSubnets.push({ "name": subnet.name, "id": s.id })
  }

  // Build the return output
  network_output['vpc'] = { "arn": vpc.arn, "id": vpc.id }
  network_output['public_subnets'] = pubSubnets
  network_output['private_subnets'] = privSubnets

  // Return the output
  return network_output
}

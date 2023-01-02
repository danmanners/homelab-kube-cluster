import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"

// Keep types in a separate file to keep things clean in this main file
import { Node, NameIdOutputs, RouteTableIds } from "./types/types"

// Configuration / Environment Variables
import * as config from "./vars/environment"

// Instantiating Constants
const pubSubnets: NameIdOutputs = {}
const privSubnets: NameIdOutputs = {}
const routeTables: RouteTableIds = {}
const routeTableRoutes: RouteTableIds = {}

// Create the VPC
const vpc = new aws.ec2.Vpc("primary", {
  cidrBlock: config.network.vpc.cidr_block,
  tags: Object.assign({},
    config.tags, { "Name": config.network.vpc.name }
  )
})

// Create the Public Subnets
for (const subnet of config.network.subnets.public) {
  const s = new aws.ec2.Subnet(subnet.name, {
    vpcId: vpc.id,
    cidrBlock: subnet.cidr_block,
    availabilityZone: config.cloud_auth.aws_region + subnet.az,
    mapPublicIpOnLaunch: true,
    tags: Object.assign({},
      config.tags, { "Name": subnet.name }
    )
  })
  pubSubnets[subnet.name] = { id: s.id }
  Object.assign({}, pubSubnets[subnet.name].id = s.id)
}

// Create the Private Subnets
for (const subnet of config.network.subnets.private) {
  const s = new aws.ec2.Subnet(subnet.name, {
    vpcId: vpc.id,
    cidrBlock: subnet.cidr_block,
    availabilityZone: config.cloud_auth.aws_region + subnet.az,
    tags: Object.assign({},
      config.tags, { "Name": subnet.name }
    )
  })
  privSubnets[subnet.name] = { id: s.id }
}

// Create the Internet Gateway
const gw = new aws.ec2.InternetGateway("gw", {
  vpcId: vpc.id,
  tags: Object.assign({},
    config.tags, { "Name": config.network.vpc.name + "-igw" }
  )
})

// Create the Elastic IP for the NAT Gateway
const natgw_eip = new aws.ec2.Eip("natgw", {
  vpc: true,
  tags: Object.assign({},
    config.tags, { "Name": config.network.vpc.name + "-igw-eip" }
  )
})

// Create the NAT Gateway
const natgw = new aws.ec2.NatGateway("natgw", {
  allocationId: natgw_eip.id,
  subnetId: pubSubnets[config.network.subnets.public[0].name].id,
  // TODO: figure out how to make this less crap
  tags: Object.assign({},
    config.tags, { "Name": config.network.vpc.name + "-ngw" }
  )
})

// Create the Public Subnet Route Tables
for (const subnet of config.network.subnets.public) {
  const rt = new aws.ec2.RouteTable(`${config.network.vpc.name}-${subnet.name}`, {
    vpcId: vpc.id,
    tags: Object.assign({},
      config.tags, { "Name": subnet.name }
    ),
  })
  routeTables[`${subnet.name}`] = rt.id
}

// Create the Private Subnet Route Tables
for (const subnet of config.network.subnets.private) {
  const rt = new aws.ec2.RouteTable(`${config.network.vpc.name}-${subnet.name}`, {
    vpcId: vpc.id,
    tags: Object.assign({},
      config.tags, { "Name": subnet.name }
    ),
  })
  routeTables[`${subnet.name}`] = rt.id
}

// Create the Public Subnet Routes on the previously created Route Tables
for (const [key, value] of Object.entries(pubSubnets)) {
  const route = new aws.ec2.Route(`${key}-ro`, {
    routeTableId: routeTables[key],
    destinationCidrBlock: "0.0.0.0/0",
    gatewayId: gw.id
  })
  routeTableRoutes[`${key}-route`] = route.id
}

// Create the Private Subnet Routes on the previously created Route Tables
for (const [key, value] of Object.entries(privSubnets)) {
  const route = new aws.ec2.Route(`${key}-ro`, {
    routeTableId: routeTables[key],
    destinationCidrBlock: "0.0.0.0/0",
    gatewayId: natgw.id
  })
  routeTableRoutes[`${key}-route`] = route.id
}

// Public Subnet Route Table Associations
for (const [key, value] of Object.entries(pubSubnets)) {
  new aws.ec2.RouteTableAssociation(`${key}-rta`, {
    subnetId: value.id,
    routeTableId: routeTables[key],
  })
}

// Private Subnet Route Table Associations
for (const [key, value] of Object.entries(privSubnets)) {
  new aws.ec2.RouteTableAssociation(`${key}-rta`, {
    subnetId: value.id,
    routeTableId: routeTables[key],
  })
}

// Identify which AMI to use
// Create IAM Policies
// Create Node Role
// Associcate IAM to Node Role
// Create the K3s Control Plane
// Ensure that the SSM Parameter exists
// Deploy the K3s Workers

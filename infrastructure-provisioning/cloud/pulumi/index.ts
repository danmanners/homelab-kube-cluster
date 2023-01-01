import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"
import * as config from "./vars/environment"

// Create the VPC
const vpc = new aws.ec2.Vpc("primary", {
  cidrBlock: config.network.vpc.cidr_block,
  tags: Object.assign({},
    config.tags,
    { "Name": config.network.vpc.name }
  )
})

// Internet Gateway
const gw = new aws.ec2.InternetGateway("gw", {
  vpcId: vpc.id,
  tags: Object.assign({},
    config.tags, { "Name": config.network.vpc.name + "-igw" }
  )
})

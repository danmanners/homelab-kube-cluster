import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export function securityGroup(
  config: any,
  vpc: pulumi.Output<string>,
  tags: any,
) {
  // Security Groups
  const sg = new aws.ec2.SecurityGroup(`securityGroup-${config["name"]}`, {
    description: config["description"],
    vpcId: vpc,
    tags: Object.assign({}, tags),
  });

  // Create and associate the Ingress Security Group Rules
  for (let k of config["ingress"]) {
    // Define expected values
    let cidrBlocks: string[] = [""];
    let fromPort: number = 0;
    let toPort: number = 0;

    // Check Port Logic
    if (!k.port) {
      fromPort = k.port_start;
      toPort = k.port_end;
    } else {
      fromPort = k.port;
      toPort = k.port;
    }

    // Check CIDR Block Logic
    if (!k.cidr_blocks) {
      cidrBlocks = [config["cidr_block"]];
    } else {
      cidrBlocks = k.cidr_blocks;
    }

    // Create and associate the Security Group Rules
    new aws.ec2.SecurityGroupRule(`ingress-${k.description}`, {
      type: "ingress",
      fromPort: fromPort,
      toPort: toPort,
      protocol: k.protocol,
      cidrBlocks: cidrBlocks,
      securityGroupId: sg.id,
    });
  }
  // Create and associate the Egress Security Group Rules
  for (let k of config["egress"]) {
    // Define expected values
    let cidrBlocks: string[] = [""];
    let fromPort: number = 0;
    let toPort: number = 0;

    // Check Port Logic
    if (!k.port) {
      fromPort = k.port_start;
      toPort = k.port_end;
    } else {
      fromPort = k.port;
      toPort = k.port;
    }

    // Check CIDR Block Logic
    if (!k.cidr_blocks) {
      cidrBlocks = [config["cidr_block"]];
    } else {
      cidrBlocks = k.cidr_blocks;
    }

    // Create and associate the Security Group Rules
    new aws.ec2.SecurityGroupRule(`egress-${k.description}`, {
      type: "egress",
      fromPort: fromPort,
      toPort: toPort,
      protocol: k.protocol,
      cidrBlocks: cidrBlocks,
      securityGroupId: sg.id,
    });
  }
  return sg;
}

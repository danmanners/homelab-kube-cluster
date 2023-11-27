import * as aws from "@pulumi/aws";

// Import the module responsible for creating the VPC
import { createVpc } from "./modules/vpc";
import { iamCreation } from "./modules/iam";
import { securityGroup } from "./modules/security-groups";
import { createInstance } from "./modules/kube-nodes";
import { createBastion } from "./modules/bastion";
// import * as iam from "./modules/iam";

// Configuration / Environment Variables
import * as config from "./vars/environment";
import { assumeRole } from "@pulumi/aws/config";
import { output } from "@pulumi/pulumi";

// Create a VPC and associated resources
const vpc = createVpc(config);

// Create the Security Groups
const sg_talos_configuration = securityGroup(
  config.security_groups["talos_configuration"],
  vpc.id,
  config.tags
);

const sg_nlb_ingress = securityGroup(
  config.security_groups["nlb_ingress"],
  vpc.id,
  config.tags
);

const iam_role = iamCreation(config);

// Create the Control Planes and Worker Nodes
for (let k of config.compute.control_plane_nodes) {
  createInstance(
    k,
    config.cloud_auth.aws_region,
    config.amis,
    vpc.privSubnets[k.subnet_name].id,
    [sg_talos_configuration.id],
    iam_role.iamInstanceProfile.arn,
    null,
    config.tags
  );
}

createBastion(
  config.compute.bastion[0], // Node Config
  config.cloud_auth.aws_region, // Region
  config.amis, // AMI
  config.network.vpc.cidr_block, // CIDR Block
  vpc.id, // VPC
  vpc.pubSubnets[config.compute.bastion[0].subnet_name].id, // Subnet
  config.security_groups.bastion, // Security Groups
  config.user_data.bastion, // User Data
  config.tags // Tags
);

// Import the module responsible for creating the VPC
import { createVpc } from "./modules/vpc";
import { iamCreation } from "./modules/iam";
import { securityGroup } from "./modules/security-groups";
import { createInstance } from "./modules/kube-nodes";
import { createBastion } from "./modules/bastion";

// Configuration / Environment Variables
import * as config from "./vars/environment";
// import { assumeRole } from "@pulumi/aws/config";
// import { output } from "@pulumi/pulumi";

// Create a VPC and associated resources
const vpc = createVpc(config); // Create the VPC and associated resources

// Create the Security Groups for Talos
const sg_talos_configuration = securityGroup(
  config.security_groups["talos_configuration"], // Config
  vpc.id, // VPC ID
  config.tags // Tags
);

// Create the NLB Ingress Security Group
const sg_nlb_ingress = securityGroup(
  config.security_groups["nlb_ingress"], // Config
  vpc.id, // VPC ID
  config.tags // Tags
);

// Create the IAM Role
const iam_role = iamCreation(config);

// Create the Control Planes and Worker Nodes
for (let k of config.compute.control_plane_nodes) {
  createInstance(
    k, // Node Config
    config.cloud_auth.aws_region, // Region
    config.amis, // AMI
    vpc.privSubnets[k.subnet_name].id, // Subnet
    [sg_talos_configuration.id], // List of Security Groups
    iam_role.iamInstanceProfile.name, // IAM Instance Profile
    null, // User Data; `null` if we're not using it
    config.tags // Tags
  );
}

// Create the Bastion Node
// This is ONLY for debugging purposes and will be removed in the future
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

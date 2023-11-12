import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Kubernetes Nodes
import { controlPlane, worker } from "./modules/kube-nodes";
import { bastion } from "./modules/bastion";
import { iamCreation } from "./modules/iam";
import { createVpc } from "./modules/vpc";

// Keep types in a separate file to keep things clean in this main file
import { keyPulumiValue } from "./types/types";

// Configuration / Environment Variables
import * as config from "./vars/environment";

// Pulumi Constants
const hostIps: keyPulumiValue = {};
const controlPlaneIps: pulumi.Output<string>[] = [];

// Create the VPC
const vpc = createVpc(config);

// Create Security Groups
const kubeNodeSecurityGroup = new aws.ec2.SecurityGroup(
  "kubeNodeSecurityGroup",
  {
    description: "Allow TLS inbound traffic",
    vpcId: vpc.id,
    tags: Object.assign({}, config.tags, { Name: "kube-master" }),
  }
);

// Ingress Security Group Rules
for (let k of config.security_groups.nlb_ingress.ingress) {
  // Define expected values
  let cidrBlocks: string[] = [""];
  let fromPort: number = 0;
  let toPort: number = 0;

  // Check Port Logic
  if (k.port_start && k.port_end) {
    fromPort = k.port_start;
    toPort = k.port_end;
  } else if (k.port) {
    fromPort = k.port;
    toPort = k.port;
  }

  // Check CIDR Block Logic
  if (!k.cidr_blocks) {
    cidrBlocks = [config.network.vpc.cidr_block];
  } else {
    cidrBlocks = k.cidr_blocks;
  }

  // Create and associate the Security Group Rules
  new aws.ec2.SecurityGroupRule(k.description, {
    type: "ingress",
    fromPort: fromPort,
    toPort: toPort,
    protocol: k.protocol,
    cidrBlocks: cidrBlocks,
    securityGroupId: kubeNodeSecurityGroup.id,
  });
}

// Egress Security Group Rules
for (let k of config.security_groups.nlb_ingress.egress) {
  // Create and associate the Security Group Rules
  new aws.ec2.SecurityGroupRule(k.description, {
    type: "egress",
    fromPort: k.port,
    toPort: k.port,
    protocol: k.protocol,
    cidrBlocks: k.cidr_blocks,
    securityGroupId: kubeNodeSecurityGroup.id,
  });
}

const iam = iamCreation(config);

// Loop through creation of the Kubernetes Control Plane Nodes
for (let node of config.compute.control_planes) {
  let controlPlaneNode = controlPlane(
    node,
    config.cloud_auth.aws_region,
    config.amis,
    Object.assign(config.tags, { "kubernetes.io/cluster/cloud": "owned" }),
    vpc.privSubnets[node.subnet_name].id,
    [kubeNodeSecurityGroup.id],
    iam.iamInstanceProfile.name,
    null
  );
  hostIps[node.name] = controlPlaneNode.privateIp;
  controlPlaneIps.push(controlPlaneNode.privateIp);
}

// Loop through creation of the Kubernetes Worker Nodes
for (let node of config.compute.workers) {
  // Loop through the workers
  let workerNode = worker(
    node,
    config.cloud_auth.aws_region,
    config.amis,
    Object.assign(config.tags, { "kubernetes.io/cluster/cloud": "owned" }),
    vpc.privSubnets[node.subnet_name].id,
    [kubeNodeSecurityGroup.id],
    iam.iamInstanceProfile.name,
    null
  );
  hostIps[node.name] = workerNode.privateIp;
}

// Create the Route53 record for the kube cluster domain name
let aRecord = `${config.general.kube_cp_hostname}.${config.general.domain}`;
new aws.route53.Record(aRecord, {
  zoneId: vpc.privateHostedZone.zoneId,
  name: aRecord,
  type: "A",
  ttl: 300,
  records: controlPlaneIps,
});

/*
The following section should be left commented **UNLESS** you're troubleshooting!!
*/

const bastionHost = bastion(
  config.compute.bastion[0],
  config.cloud_auth.aws_region,
  config.network.vpc.cidr_block,
  config.amis,
  vpc.id,
  vpc.pubSubnets[config.compute.bastion[0].subnet_name].id,
  config.user_data.bastion,
  config.security_groups.bastion,
  config.tags
);

// Create the Route53 record for the Bastion/wireguard Netmaker host
const bastionNetmaker = new aws.route53.Record(`wg.${config.general.domain}`, {
  zoneId: config.general.public_hosted_zone,
  name: `wg.${config.general.domain}`,
  type: "A",
  ttl: 300,
  records: [bastionHost.publicIp],
});

// Create the Internal Route53 record for the Bastion/wireguard Netmaker host
const bastionNetmakerInternal = new aws.route53.Record(
  `wg.${config.general.domain}-internal`,
  {
    zoneId: vpc.privateHostedZone.zoneId,
    name: `wg.${config.general.domain}`,
    type: "A",
    ttl: 300,
    records: [bastionHost.privateIp],
  }
);

// Create the required subdomain records internal and external
for (const subdomain of ["dashboard", "api", "broker"]) {
  const sdext = new aws.route53.Record(
    `${subdomain}.wg.${config.general.domain}`,
    {
      zoneId: config.general.public_hosted_zone,
      name: `${subdomain}.wg.${config.general.domain}`,
      type: "CNAME",
      ttl: 300,
      records: [bastionNetmaker.fqdn],
    }
  );

  const sdin = new aws.route53.Record(
    `${subdomain}.wg.${config.general.domain}-internal`,
    {
      zoneId: vpc.privateHostedZone.zoneId,
      name: `${subdomain}.wg.${config.general.domain}`,
      type: "CNAME",
      ttl: 300,
      records: [bastionNetmakerInternal.fqdn],
    }
  );
}

export const IPs: keyPulumiValue = {
  bastionIP: bastionHost.publicIp,
};

// Add the kubernetes hosts private IPs to the pulumi output
for (let [key, value] of Object.entries(hostIps)) {
  IPs[key] = value;
}

// for (const [key, value] of Object.entries(pubSubnets)) {

export const GitOps_Resources = {
  "certmanager-noderole": iam.kubeNodeRole.arn,
};

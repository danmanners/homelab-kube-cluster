import * as aws from "@pulumi/aws";

// Kubernetes Nodes
import { controlPlane, worker } from "./kube-nodes";
import { bastion } from "./modules/bastion";
import { iamCreation } from "./modules/iam";

// Keep types in a separate file to keep things clean in this main file
import { NameIdOutputs, keyPulumiValue } from "./types/types";

// Configuration / Environment Variables
import * as config from "./vars/environment";

// Instantiating Constants
const pubSubnets: NameIdOutputs = {};
const privSubnets: NameIdOutputs = {};
const routeTables: keyPulumiValue = {};
const routeTableRoutes: keyPulumiValue = {};
const hostIps: keyPulumiValue = {};

// Create the VPC
const vpc = new aws.ec2.Vpc("primary", {
  cidrBlock: config.network.vpc.cidr_block,
  enableDnsHostnames: true,
  tags: Object.assign({}, config.tags, { Name: config.network.vpc.name }),
});

// Private Hosted Zone
const privateHostedZone = new aws.route53.Zone("primary", {
  name: config.general.domain,
  comment: config.general.domain_comment,
  vpcs: [{ vpcId: vpc.id, vpcRegion: config.cloud_auth.aws_region }],
  tags: Object.assign({}, config.tags, {
    Name: config.general.domain,
  }),
});

// Create the DHCP Options
const dhcpOpts = new aws.ec2.VpcDhcpOptions("cloud.danmanners.com", {
  domainName: config.general.domain,
  netbiosNodeType: "2",
  domainNameServers: ["169.254.169.253"],
  tags: Object.assign({}, config.tags, {
    Name: config.general.domain,
  }),
});

// Associate the DHCP Options to the VPC
new aws.ec2.VpcDhcpOptionsAssociation("cloud.danmanners.com", {
  vpcId: vpc.id,
  dhcpOptionsId: dhcpOpts.id,
});

// Create the Public Subnets
for (const subnet of config.network.subnets.public) {
  const s = new aws.ec2.Subnet(subnet.name, {
    vpcId: vpc.id,
    cidrBlock: subnet.cidr_block,
    availabilityZone: `${config.cloud_auth.aws_region}${subnet.az}`,
    mapPublicIpOnLaunch: true,
    tags: Object.assign({}, config.tags, {
      Name: subnet.name,
      "kubernetes.io/role/elb": "1",
      "kubernetes.io/cluster/homelab-cloud": "shared",
    }),
  });
  pubSubnets[subnet.name] = { id: s.id };
  Object.assign({}, (pubSubnets[subnet.name].id = s.id));
}

// Create the Private Subnets
for (const subnet of config.network.subnets.private) {
  const s = new aws.ec2.Subnet(subnet.name, {
    vpcId: vpc.id,
    cidrBlock: subnet.cidr_block,
    availabilityZone: `${config.cloud_auth.aws_region}${subnet.az}`,
    tags: Object.assign({}, config.tags, {
      Name: subnet.name,
      "kubernetes.io/role/internal-elb": "1",
      "kubernetes.io/cluster/homelab-cloud": "shared",
    }),
  });
  privSubnets[subnet.name] = { id: s.id };
}

// Create the Internet Gateway
const gw = new aws.ec2.InternetGateway("gw", {
  vpcId: vpc.id,
  tags: Object.assign({}, config.tags, {
    Name: `${config.network.vpc.name}-igw`,
  }),
});

// Create the Elastic IP for the NAT Gateway
const natgw_eip = new aws.ec2.Eip("natgw", {
  vpc: true,
  tags: Object.assign({}, config.tags, {
    Name: `${config.network.vpc.name}-igw`,
  }),
});

// Create the NAT Gateway
const natgw = new aws.ec2.NatGateway("natgw", {
  allocationId: natgw_eip.id,
  subnetId: pubSubnets[config.network.subnets.public[0].name].id,
  privateIp: config.network.subnets.public[0].privateIP,
  // TODO: figure out how to make this less crap
  tags: Object.assign({}, config.tags, {
    Name: `${config.network.vpc.name}-ngw`,
  }),
});

// Create the Public Subnet Route Tables
for (const subnet of config.network.subnets.public) {
  const rt = new aws.ec2.RouteTable(
    `${config.network.vpc.name}-${subnet.name}`,
    {
      vpcId: vpc.id,
      tags: Object.assign({}, config.tags, { Name: subnet.name }),
    }
  );
  routeTables[`${subnet.name}`] = rt.id;
}

// Create the Private Subnet Route Tables
for (const subnet of config.network.subnets.private) {
  const rt = new aws.ec2.RouteTable(
    `${config.network.vpc.name}-${subnet.name}`,
    {
      vpcId: vpc.id,
      tags: Object.assign({}, config.tags, { Name: subnet.name }),
    }
  );
  routeTables[`${subnet.name}`] = rt.id;
}

// Create the Public Subnet Routes on the previously created Route Tables
for (const [key, value] of Object.entries(pubSubnets)) {
  const route = new aws.ec2.Route(`${key}-ro`, {
    routeTableId: routeTables[key],
    destinationCidrBlock: "0.0.0.0/0",
    gatewayId: gw.id,
  });
  routeTableRoutes[`${key}-route`] = route.id;
}

// Create the Private Subnet Routes on the previously created Route Tables
for (const [key, value] of Object.entries(privSubnets)) {
  const route = new aws.ec2.Route(`${key}-ro`, {
    routeTableId: routeTables[key],
    destinationCidrBlock: "0.0.0.0/0",
    natGatewayId: natgw.id,
  });
  routeTableRoutes[`${key}-route`] = route.id;
}

// Public Subnet Route Table Associations
for (const [key, value] of Object.entries(pubSubnets)) {
  new aws.ec2.RouteTableAssociation(`${key}-rta`, {
    subnetId: value.id,
    routeTableId: routeTables[key],
  });
}

// Private Subnet Route Table Associations
for (const [key, value] of Object.entries(privSubnets)) {
  new aws.ec2.RouteTableAssociation(`${key}-rta`, {
    subnetId: value.id,
    routeTableId: routeTables[key],
  });
}

// Security Groups
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

const iam = iamCreation(config)

const kubeControlPlane1 = controlPlane(
  config.compute.control_planes[0],
  config.cloud_auth.aws_region,
  config.amis,
  config.tags,
  privSubnets[config.compute.control_planes[0].subnet_name].id,
  [kubeNodeSecurityGroup.id],
  iam.iamInstanceProfile.name,
  config.user_data.kube
);


for (let node of config.compute.workers) {
  // Loop through the workers
  let workerNode = worker(
    node,
    config.cloud_auth.aws_region,
    config.amis,
    config.tags,
    privSubnets[node.subnet_name].id,
    [kubeNodeSecurityGroup.id],
    iam.iamInstanceProfile.name,
    config.user_data.kube
  );
  hostIps[node.name] = workerNode.privateIp
}

// Create the Route53 record for the kube cluster domain name
const kubeControlPlaneHostname = new aws.route53.Record(
  `${config.general.kube_cp_hostname}.${config.general.domain}`,
  {
    zoneId: privateHostedZone.zoneId,
    name: `${config.general.kube_cp_hostname}.${config.general.domain}`,
    type: "A",
    ttl: 300,
    records: [kubeControlPlane1.privateIp],
  }
);

/*
The following section should be left commented **UNLESS** you're troubleshooting!!
*/

const bastionHost = bastion(
  config.compute.bastion[0],
  config.cloud_auth.aws_region,
  config.network.vpc.cidr_block,
  config.amis,
  vpc.id,
  pubSubnets[config.compute.bastion[0].subnet_name].id,
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
    zoneId: privateHostedZone.zoneId,
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
      zoneId: privateHostedZone.zoneId,
      name: `${subdomain}.wg.${config.general.domain}`,
      type: "CNAME",
      ttl: 300,
      records: [bastionNetmakerInternal.fqdn],
    }
  );
}

export const IPs: keyPulumiValue = {
  bastionIP: bastionHost.publicIp,
  "control-plane-1-ip": kubeControlPlane1.privateIp,
};

for (let [key, value] of Object.entries(hostIps)) {
  IPs[key] = value
};

// for (const [key, value] of Object.entries(pubSubnets)) {

export const GitOps_Resources = {
  "certmanager-noderole": iam.kubeNodeRole.arn,
};

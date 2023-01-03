import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"

// Keep types in a separate file to keep things clean in this main file
import { NameIdOutputs, RouteTableIds } from "./types/types"

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
  enableDnsHostnames: true,
  tags: Object.assign({},
    config.tags, { Name: config.network.vpc.name }
  )
})

// Private Hosted Zone
const privateHostedZone = new aws.route53.Zone("primary", {
  name: config.general.domain,
  comment: config.general.domain_comment,
  vpcs: [{ vpcId: vpc.id, vpcRegion: config.cloud_auth.aws_region }],
  tags: Object.assign({},
    config.tags, {
    Name: config.general.domain,
  })
})

// Create the DHCP Options
const dhcpOpts = new aws.ec2.VpcDhcpOptions("cloud.danmanners.com", {
  domainName: config.general.domain,
  netbiosNodeType: "2",
  domainNameServers: [
    "169.254.169.253"
  ],
  tags: Object.assign({},
    config.tags, {
    Name: config.general.domain,
  })
})

// Associate the DHCP Options to the VPC
new aws.ec2.VpcDhcpOptionsAssociation("cloud.danmanners.com", {
  vpcId: vpc.id,
  dhcpOptionsId: dhcpOpts.id,
})

// Create the Public Subnets
for (const subnet of config.network.subnets.public) {
  const s = new aws.ec2.Subnet(subnet.name, {
    vpcId: vpc.id,
    cidrBlock: subnet.cidr_block,
    availabilityZone: `${config.cloud_auth.aws_region}${subnet.az}`,
    mapPublicIpOnLaunch: true,
    tags: Object.assign({},
      config.tags, {
      Name: subnet.name,
      "kubernetes.io/role/elb": "true",
      "kubernetes.io/cluster/cluster-name": "shared"
    })
  })
  pubSubnets[subnet.name] = { id: s.id }
  Object.assign({}, pubSubnets[subnet.name].id = s.id)
}

// Create the Private Subnets
for (const subnet of config.network.subnets.private) {
  const s = new aws.ec2.Subnet(subnet.name, {
    vpcId: vpc.id,
    cidrBlock: subnet.cidr_block,
    availabilityZone: `${config.cloud_auth.aws_region}${subnet.az}`,
    tags: Object.assign({},
      config.tags, { Name: subnet.name }
    )
  })
  privSubnets[subnet.name] = { id: s.id }
}

// Create the Internet Gateway
const gw = new aws.ec2.InternetGateway("gw", {
  vpcId: vpc.id,
  tags: Object.assign({},
    config.tags, { Name: `${config.network.vpc.name}-igw` }
  )
})

// Create the Elastic IP for the NAT Gateway
const natgw_eip = new aws.ec2.Eip("natgw", {
  vpc: true,
  tags: Object.assign({},
    config.tags, { Name: `${config.network.vpc.name}-igw` }
  )
})

// Create the NAT Gateway
const natgw = new aws.ec2.NatGateway("natgw", {
  allocationId: natgw_eip.id,
  subnetId: pubSubnets[config.network.subnets.public[0].name].id,
  privateIp: config.network.subnets.public[0].privateIP,
  // TODO: figure out how to make this less crap
  tags: Object.assign({},
    config.tags, { Name: `${config.network.vpc.name}-ngw` }
  )
})

// Create the Public Subnet Route Tables
for (const subnet of config.network.subnets.public) {
  const rt = new aws.ec2.RouteTable(`${config.network.vpc.name}-${subnet.name}`, {
    vpcId: vpc.id,
    tags: Object.assign({},
      config.tags, { Name: subnet.name }
    ),
  })
  routeTables[`${subnet.name}`] = rt.id
}

// Create the Private Subnet Route Tables
for (const subnet of config.network.subnets.private) {
  const rt = new aws.ec2.RouteTable(`${config.network.vpc.name}-${subnet.name}`, {
    vpcId: vpc.id,
    tags: Object.assign({},
      config.tags, { Name: subnet.name }
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
    natGatewayId: natgw.id
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

/* The node policy does everything below
  Create IAM Policiess
  - Load Balancer - Read/Write
  - Route53 Read/Write
  - Network Interface Read/Write
  - TODO: S3 Read/Write 
  - EBS Read/Write - https://docs.aws.amazon.com/eks/latest/userguide/csi-iam-role.html
*/
const nodePolicy = new aws.iam.Policy("talosNodePolicies", {
  path: "/",
  description: "Policy for Talos Kubernetes Nodes",
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      // AWS VPC CNI - https://github.com/aws/amazon-vpc-cni-k8s/blob/master/docs/iam-policy.md
      {
        Effect: "Allow",
        Action: [
          "ec2:AssignPrivateIpAddresses",
          "ec2:AttachNetworkInterface",
          "ec2:CreateNetworkInterface",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeInstances",
          "ec2:DescribeTags",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DescribeInstanceTypes",
          "ec2:DetachNetworkInterface",
          "ec2:ModifyNetworkInterfaceAttribute",
          "ec2:UnassignPrivateIpAddresses"
        ],
        Resource: "*"
      },
      {
        Effect: "Allow",
        Action: ["ec2:CreateTags"],
        Resource: ["arn:aws:ec2:*:*:network-interface/*"]
      },
      // Cert-Manager - https://cert-manager.io/docs/configuration/acme/dns01/route53/
      {
        Effect: "Allow",
        Action: "route53:GetChange",
        Resource: "arn:aws:route53:::change/*"
      },
      {
        Effect: "Allow",
        Action: [
          "route53:ChangeResourceRecordSets",
          "route53:ListResourceRecordSets"
        ],
        Resource: "arn:aws:route53:::hostedzone/*"
      },
      {
        Effect: "Allow",
        Action: "route53:ListHostedZonesByName",
        Resource: "*"
      },
      // External DNS - https://aws.amazon.com/premiumsupport/knowledge-center/eks-set-up-externaldns/
      {
        Effect: "Allow",
        Action: ["route53:ChangeResourceRecordSets"],
        Resource: ["arn:aws:route53:::hostedzone/*"]
      },
      {
        Effect: "Allow",
        Action: [
          "route53:ListHostedZones",
          "route53:ListResourceRecordSets"
        ],
        Resource: "*"
      },
      // AWS Load Balancer Controller - https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/5634fa2e1ab417a9a0167a1d561b04523f2965ff/docs/install/iam_policy.json
      {
        Effect: "Allow",
        Action: ["iam:CreateServiceLinkedRole"],
        Resource: "*",
        Condition: {
          StringEquals: {
            "iam:AWSServiceName": "elasticloadbalancing.amazonaws.com"
          }
        }
      },
      {
        Effect: "Allow",
        Action: [
          "ec2:DescribeAccountAttributes",
          "ec2:DescribeAddresses",
          "ec2:DescribeAvailabilityZones",
          "ec2:DescribeInternetGateways",
          "ec2:DescribeVpcs",
          "ec2:DescribeVpcPeeringConnections",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeInstances",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DescribeTags",
          "ec2:GetCoipPoolUsage",
          "ec2:DescribeCoipPools",
          "elasticloadbalancing:DescribeLoadBalancers",
          "elasticloadbalancing:DescribeLoadBalancerAttributes",
          "elasticloadbalancing:DescribeListeners",
          "elasticloadbalancing:DescribeListenerCertificates",
          "elasticloadbalancing:DescribeSSLPolicies",
          "elasticloadbalancing:DescribeRules",
          "elasticloadbalancing:DescribeTargetGroups",
          "elasticloadbalancing:DescribeTargetGroupAttributes",
          "elasticloadbalancing:DescribeTargetHealth",
          "elasticloadbalancing:DescribeTags"
        ],
        Resource: "*"
      },
      {
        Effect: "Allow",
        Action: [
          "cognito-idp:DescribeUserPoolClient",
          "acm:ListCertificates",
          "acm:DescribeCertificate",
          "iam:ListServerCertificates",
          "iam:GetServerCertificate",
          "waf-regional:GetWebACL",
          "waf-regional:GetWebACLForResource",
          "waf-regional:AssociateWebACL",
          "waf-regional:DisassociateWebACL",
          "wafv2:GetWebACL",
          "wafv2:GetWebACLForResource",
          "wafv2:AssociateWebACL",
          "wafv2:DisassociateWebACL",
          "shield:GetSubscriptionState",
          "shield:DescribeProtection",
          "shield:CreateProtection",
          "shield:DeleteProtection"
        ],
        Resource: "*"
      },
      {
        Effect: "Allow",
        Action: [
          "ec2:AuthorizeSecurityGroupIngress",
          "ec2:RevokeSecurityGroupIngress"
        ],
        Resource: "*"
      },
      {
        Effect: "Allow",
        Action: [
          "ec2:CreateSecurityGroup"
        ],
        Resource: "*"
      },
      {
        Effect: "Allow",
        Action: [
          "ec2:CreateTags"
        ],
        Resource: "arn:aws:ec2:*:*:security-group/*",
        Condition: {
          "StringEquals": {
            "ec2:CreateAction": "CreateSecurityGroup"
          },
          Null: {
            "aws:RequestTag/elbv2.k8s.aws/cluster": "false"
          }
        }
      },
      {
        Effect: "Allow",
        Action: [
          "ec2:CreateTags",
          "ec2:DeleteTags"
        ],
        Resource: "arn:aws:ec2:*:*:security-group/*",
        Condition: {
          Null: {
            "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
            "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
          }
        }
      },
      {
        Effect: "Allow",
        Action: [
          "ec2:AuthorizeSecurityGroupIngress",
          "ec2:RevokeSecurityGroupIngress",
          "ec2:DeleteSecurityGroup"
        ],
        Resource: "*",
        Condition: {
          Null: {
            "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
          }
        }
      },
      {
        Effect: "Allow",
        Action: [
          "elasticloadbalancing:CreateLoadBalancer",
          "elasticloadbalancing:CreateTargetGroup"
        ],
        Resource: "*",
        Condition: {
          Null: {
            "aws:RequestTag/elbv2.k8s.aws/cluster": "false"
          }
        }
      },
      {
        Effect: "Allow",
        Action: [
          "elasticloadbalancing:CreateListener",
          "elasticloadbalancing:DeleteListener",
          "elasticloadbalancing:CreateRule",
          "elasticloadbalancing:DeleteRule"
        ],
        Resource: "*"
      },
      {
        Effect: "Allow",
        Action: [
          "elasticloadbalancing:AddTags",
          "elasticloadbalancing:RemoveTags"
        ],
        Resource: [
          "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
          "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
          "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*"
        ],
        Condition: {
          Null: {
            "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
            "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
          }
        }
      },
      {
        Effect: "Allow",
        Action: [
          "elasticloadbalancing:AddTags",
          "elasticloadbalancing:RemoveTags"
        ],
        Resource: [
          "arn:aws:elasticloadbalancing:*:*:listener/net/*/*/*",
          "arn:aws:elasticloadbalancing:*:*:listener/app/*/*/*",
          "arn:aws:elasticloadbalancing:*:*:listener-rule/net/*/*/*",
          "arn:aws:elasticloadbalancing:*:*:listener-rule/app/*/*/*"
        ]
      },
      {
        Effect: "Allow",
        Action: [
          "elasticloadbalancing:ModifyLoadBalancerAttributes",
          "elasticloadbalancing:SetIpAddressType",
          "elasticloadbalancing:SetSecurityGroups",
          "elasticloadbalancing:SetSubnets",
          "elasticloadbalancing:DeleteLoadBalancer",
          "elasticloadbalancing:ModifyTargetGroup",
          "elasticloadbalancing:ModifyTargetGroupAttributes",
          "elasticloadbalancing:DeleteTargetGroup"
        ],
        Resource: "*",
        Condition: {
          Null: {
            "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
          }
        }
      },
      {
        Effect: "Allow",
        Action: [
          "elasticloadbalancing:RegisterTargets",
          "elasticloadbalancing:DeregisterTargets"
        ],
        Resource: "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*"
      },
      {
        Effect: "Allow",
        Action: [
          "elasticloadbalancing:SetWebAcl",
          "elasticloadbalancing:ModifyListener",
          "elasticloadbalancing:AddListenerCertificates",
          "elasticloadbalancing:RemoveListenerCertificates",
          "elasticloadbalancing:ModifyRule"
        ],
        Resource: "*"
      },
    ]
  }),
})

// Create IAM Role
const talosNodeRole = new aws.iam.Role("talosNodeRole", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Action: "sts:AssumeRole",
      Effect: "Allow",
      Sid: "",
      Principal: {
        Service: "ec2.amazonaws.com",
      },
    }],
  }),
  tags: Object.assign({},
    config.tags, { Name: "talos-node-role" }
  )
})

// Associcate IAM to Role
new aws.iam.RolePolicyAttachment("talosPolicyAttachment", {
  role: talosNodeRole.name,
  policyArn: nodePolicy.arn,
})

// Create the IAM Instance Profile
const iamInstanceProfile = new aws.iam.InstanceProfile(
  "talosInstanceProfile", { role: talosNodeRole.name }
)

// Security Groups
const talosNodeSecurityGroup = new aws.ec2.SecurityGroup("talosNodeSecurityGroup", {
  description: "Allow TLS inbound traffic",
  vpcId: vpc.id,
  tags: Object.assign({},
    config.tags, { Name: "talos-master" }
  ),
})

// Ingress Security Group Rules
for (let k of config.security_groups.nlb_ingress.ingress) {
  // Define expected values
  let cidrBlocks: string[] = [""]
  let fromPort: number = 0
  let toPort: number = 0

  // Check Port Logic
  if (k.port_start && k.port_end) {
    fromPort = k.port_start
    toPort = k.port_end
  } else if (k.port) {
    fromPort = k.port
    toPort = k.port
  }

  // Check CIDR Block Logic
  if (!k.cidr_blocks) {
    cidrBlocks = [config.network.vpc.cidr_block]
  } else {
    cidrBlocks = k.cidr_blocks
  }

  // Create and associate the Security Group Rules
  new aws.ec2.SecurityGroupRule(k.description, {
    type: "ingress",
    fromPort: fromPort,
    toPort: toPort,
    protocol: k.protocol,
    cidrBlocks: cidrBlocks,
    securityGroupId: talosNodeSecurityGroup.id,
  })
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
    securityGroupId: talosNodeSecurityGroup.id,
  })
}

// Create the talos Control Plane & associate the role
const talosControlPlane = new aws.ec2.Instance("talos-master", {
  ami: config.amis[config.cloud_auth.aws_region].masters_arm64,
  instanceType: config.compute.control_planes[0].instance_size,

  // Networking
  subnetId: privSubnets[config.compute.control_planes[0].subnet_name].id,
  sourceDestCheck: false,
  privateIp: config.compute.control_planes[0].privateIp,
  vpcSecurityGroupIds: [talosNodeSecurityGroup.id],
  privateDnsNameOptions: {
    enableResourceNameDnsARecord: true,
    hostnameType: "resource-name",
  },

  // Storage
  rootBlockDevice: {
    deleteOnTermination: true,
    volumeType: config.compute.control_planes[0].root_volume_type,
    volumeSize: config.compute.control_planes[0].root_volume_size
  },

  // IAM Instance Profile
  iamInstanceProfile: iamInstanceProfile.name,

  // Tags
  tags: Object.assign({},
    config.tags, { Name: "talos-master" }
  ),
  volumeTags: Object.assign({},
    config.tags, { Name: "talos-master" }
  ),
})

/*
The following section should be left commented **UNLESS** you're troubleshooting!!
*/
// Security Groups
const bastionSecurityGroup = new aws.ec2.SecurityGroup("bastionSecurityGroup", {
  description: "Allow SSH Ingress",
  vpcId: vpc.id,
  tags: Object.assign({},
    config.tags, { Name: config.compute.bastion[0].name }
  ),
})

// Bastion Security Group Stuffs
for (let k of config.security_groups.bastion.ingress) {
  // Define expected values
  let cidrBlocks: string[] = [""]
  let fromPort: number = 0
  let toPort: number = 0

  // Check Port Logic
  fromPort = k.port
  toPort = k.port

  // Check CIDR Block Logic
  if (!k.cidr_blocks) {
    cidrBlocks = [config.network.vpc.cidr_block]
  } else {
    cidrBlocks = k.cidr_blocks
  }

  // Create and associate the Security Group Rules
  new aws.ec2.SecurityGroupRule(`bastion-${k.description}`, {
    type: "ingress",
    fromPort: fromPort,
    toPort: toPort,
    protocol: k.protocol,
    cidrBlocks: cidrBlocks,
    securityGroupId: bastionSecurityGroup.id,
  })
}

// Egress Security Group Rules
for (let k of config.security_groups.bastion.egress) {
  // Create and associate the Security Group Rules
  new aws.ec2.SecurityGroupRule(`bastion-${k.description}`, {
    type: "egress",
    fromPort: k.port,
    toPort: k.port,
    protocol: k.protocol,
    cidrBlocks: k.cidr_blocks,
    securityGroupId: bastionSecurityGroup.id,
  })
}

const bastionNodePolicy = new aws.iam.Policy("bastionNodePolicy", {
  path: "/",
  description: "Policy for Bastion",
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "VisualEditor0",
        Effect: "Allow",
        Action: [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey",
          "ecr:ListImages",
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
        ],
        Resource: [
          "arn:aws:kms:us-east-1:977656673179:key/7e829b85-6fed-4598-b675-8ebeea105c4c",
          "arn:aws:ecr:us-east-1:977656673179:repository/homelab-provisioning",
        ]
      },
      {
        Sid: "VisualEditor1",
        Effect: "Allow",
        Action: "ecr:GetAuthorizationToken",
        Resource: "*"
      },
    ]
  }),
})

// Create Bastion IAM Role
const bastionNodeRole = new aws.iam.Role("bastionNodeRole", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Action: "sts:AssumeRole",
      Effect: "Allow",
      Sid: "",
      Principal: {
        Service: "ec2.amazonaws.com",
      },
    }],
  }),
  tags: Object.assign({},
    config.tags, { Name: "bastion-node-role" }
  )
})

// Associcate Bastion IAM to Role
new aws.iam.RolePolicyAttachment("bastionPolicyAttachment", {
  role: bastionNodeRole.name,
  policyArn: bastionNodePolicy.arn,
})

// Create the IAM Instance Profile
const bastionIamInstanceProfile = new aws.iam.InstanceProfile(
  "bastionInstanceProfile", { role: bastionNodeRole.name }
)

// Bastion Compute Node
const bastion = new aws.ec2.Instance("bastion", {
  ami: config.amis[config.cloud_auth.aws_region].bastion_amd64,
  instanceType: config.compute.bastion[0].instance_size,

  // Networking
  subnetId: pubSubnets[config.compute.bastion[0].subnet_name].id,
  sourceDestCheck: false,
  privateIp: config.compute.bastion[0].privateIp,
  vpcSecurityGroupIds: [bastionSecurityGroup.id],
  privateDnsNameOptions: {
    enableResourceNameDnsARecord: true,
    hostnameType: "resource-name",
  },

  // Storage
  rootBlockDevice: {
    deleteOnTermination: true,
    volumeType: config.compute.bastion[0].root_volume_type,
    volumeSize: config.compute.bastion[0].root_volume_size
  },

  // IAM Instance Profile
  iamInstanceProfile: bastionIamInstanceProfile.name,

  // Cloud-Init - SSH Load
  userData: `
#cloud-config
users:
  - name: dan
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBvwr0v1C32Xc72AqJexn0fEsESblReaGEPLeTs/Fa5i DM Fedora Desktop
`,

  // Tags
  tags: Object.assign({},
    config.tags, { Name: config.compute.bastion[0].name }
  ),
  volumeTags: Object.assign({},
    config.tags, { Name: config.compute.bastion[0].name }
  ),
})

export const bastionPublicIP = bastion.publicIp
/*
Make sure the above section is commented **UNLESS** you're troubleshooting!!
*/

// TODO: Deploy the talos Workers
// TODO: talos Master Provisioning
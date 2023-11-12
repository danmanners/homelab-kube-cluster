import * as aws from "@pulumi/aws";

// Import the module responsible for creating the VPC
import { createVpc } from "./modules/vpc";

// Configuration / Environment Variables
import * as config from "./vars/environment";
import { assumeRole } from "@pulumi/aws/config";
import { output } from "@pulumi/pulumi";

// Create a VPC and associated resources
const vpc = createVpc(config);

// Create Security Groups
const kubeNodeSecurityGroup = new aws.ec2.SecurityGroup("kubeNodeSecurityGroup",
  {
    description: "Allow TLS inbound traffic",
    vpcId: vpc.id,
    tags: Object.assign({}, config.tags, { Name: "ecsIngeress" }),
  }
);

// Ingress Security Group Rules
for (let k of config.security_groups.nlb_ingress.ingress) {
  // Define expected values
  let cidrBlocks: string[] = [""];
  let fromPort: number = 0;
  let toPort: number = 0;

  // Check Port Logic
  if (k.port) {
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

// Determine latest EC2 AMI
const latestAmi = aws.ec2.getAmiIds({
  owners: ["591542846629"], // Amazon Owner Account ID
  filters: [
    { name: "name", values: ["al2023-ami-ecs-hvm-*"] },
    { name: "virtualization-type", values: ["hvm"] },
    { name: "architecture", values: ["arm64"] },
  ],
});

export const currentAmi = {
  "latestAmi": latestAmi.then((latestAmi) => latestAmi.ids[0]),
};

// Get the IAM policy document for the role
const assumeRolePolicy = aws.iam.getPolicyDocument({
  statements: [{
    actions: ["sts:AssumeRole"],
    principals: [{
      identifiers: ["ecs-tasks.amazonaws.com"],
      type: "Service",
    }],
  }],
});

// Create the new role
const ecsNodeRole = new aws.iam.Role("ecsNodeRole", {
  assumeRolePolicy: assumeRolePolicy.then(assumeRolePolicy => assumeRolePolicy.json),
  path: "/",
});

// Create the IAM Instance Profile
const ecsNodeInstanceProfile = new aws.iam.InstanceProfile("ecsNodeInstanceProfile", {
  role: ecsNodeRole.name,
});

// EC2 Launch Template
const ecsLaunchTemplate = new aws.ec2.LaunchTemplate("ecs-lt", {
  namePrefix: "ecs",
  updateDefaultVersion: true,
  imageId: latestAmi.then((latestAmi) => latestAmi.ids[0]),
  instanceType: "t4g.small",
  // Set disk values
  blockDeviceMappings: [{
    deviceName: "/dev/xvda",
    ebs: {
      volumeSize: 32,
    },
  }],
  // Enable monitoring
  monitoring: {
    enabled: true,
  },
  // Set the security group IDs
  vpcSecurityGroupIds: [kubeNodeSecurityGroup.id],
  tags: config.tags,
  iamInstanceProfile: {
    name: ecsNodeInstanceProfile.name
  },
  tagSpecifications: [{
    resourceType: "instance",
    tags: Object.assign(config.tags, { Name: "ecsNode" })
  }],
});

// EC2 Autoscaling Group
const autoscalingGroup = new aws.autoscaling.Group("homelab-ecs-scaler", {
  vpcZoneIdentifiers: [
    vpc.pubSubnets[config.network.subnets.public[0].name].id,
    vpc.pubSubnets[config.network.subnets.public[1].name].id,
  ],
  desiredCapacity: 1,
  maxSize: 2,
  minSize: 1,
  healthCheckGracePeriod: 180,
  launchTemplate: {
    id: ecsLaunchTemplate.id,
    version: "$Latest",
  },
});

// ECS Cluster
const ecsCluster = new aws.ecs.Cluster("homelab", {
  name: "homelab",
  tags: config.tags,
});

// ECS Capacity Provider
const ecsCapacityProvider = new aws.ecs.CapacityProvider("capacity", { autoScalingGroupProvider: {
  autoScalingGroupArn: autoscalingGroup.arn,
  managedTerminationProtection: "ENABLED",
  managedScaling: {
    status: "ENABLED",
    instanceWarmupPeriod: 180,
    maximumScalingStepSize: 1000,
    minimumScalingStepSize: 1,
    targetCapacity: 10,
  },
}});

// ECS Cluster Capacity Association
const capProviders = new aws.ecs.ClusterCapacityProviders("homelab", {
  clusterName: ecsCluster.name,
  capacityProviders: [ecsCapacityProvider.name],
});

// Nginx Reverse Proxy Task Definition
const nginxTaskDefinition = new aws.ecs.TaskDefinition("nginx-reverseproxy", {
  family: "nginx",
  networkMode: "host",
  requiresCompatibilities: ["EC2"],
  runtimePlatform: {
    cpuArchitecture: "ARM64",
    operatingSystemFamily: "LINUX",
  },
  containerDefinitions: JSON.stringify([
    {
      name: "nginx",
      image: "docker.io/library/nginx:1.25-alpine",
      cpu: 512,
      memory: 512,
      portMappings: [
        {
          containerPort: 80,
          hostPort: 80,
          protocol: "tcp",
        },
        {
          containerPort: 443,
          hostPort: 443,
          protocol: "tcp",
        },
      ],
    },
  ]),
});

// Nginx Reverse Proxy Service Deployment
const nginxServiceDeployment = new aws.ecs.Service("nginx-reverseproxy", {
  cluster: ecsCluster.id,
  taskDefinition: nginxTaskDefinition.arn,
  launchType: "EC2",
  desiredCount: 2,
  orderedPlacementStrategies: [{
    type: "binpack",
    field: "cpu",
  }],
  // placementConstraints: [{
  //   type: "memberOf",
  //   expression: `attribute:ecs.availability-zone in [${config.network.subnets.public[0].az}, ${config.network.subnets.public[1].az}]`,
  // }],
});

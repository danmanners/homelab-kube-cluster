import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { nodeInfo } from "../types/types";

// Create a load balancer
export function createLoadBalancer(
  name: string,
  subnetIds: pulumi.Output<string>[],
  securityGroupIds: pulumi.Output<string>[],
  nodes: nodeInfo,
  tags?: any
) {
  const loadBalancer = new aws.lb.LoadBalancer(name, {
    name: name,
    internal: false,
    loadBalancerType: "network",
    subnets: subnetIds,
    enableDeletionProtection: true,
    securityGroups: securityGroupIds,
    tags: tags,
  });

  // Create the HTTP target Group
  const httpGroup = new aws.lb.TargetGroup(`${name}-http-tg`, {
    name: `${name}-http-tg`,
    port: 80,
    protocol: "TCP",
    targetType: "instance",
    vpcId: loadBalancer.vpcId,
    deregistrationDelay: 10,
    healthCheck: {
      port: "32120",
      protocol: "TCP",
    },
    tags: Object.assign({}, tags, { Name: `${name}-tg` }),
  });

  // Create the HTTPS target Group
  const httpsGroup = new aws.lb.TargetGroup(`${name}-https-tg`, {
    name: `${name}-https-tg`,
    port: 443,
    protocol: "TCP",
    targetType: "instance",
    vpcId: loadBalancer.vpcId,
    deregistrationDelay: 10,
    healthCheck: {
      port: "32130",
      protocol: "TCP",
    },
    tags: Object.assign({}, tags, { Name: `${name}-tg` }),
  });

  // Create the HTTP listener
  const httpListener = new aws.lb.Listener(`${name}-http-listener`, {
    loadBalancerArn: loadBalancer.arn,
    port: 80,
    protocol: "TCP",
    defaultActions: [
      {
        type: "forward",
        targetGroupArn: httpGroup.arn,
      },
    ],
  });

  // Create the HTTPS listener
  const httpsListener = new aws.lb.Listener(`${name}-https-listener`, {
    loadBalancerArn: loadBalancer.arn,
    port: 443,
    protocol: "TCP",
    defaultActions: [
      {
        type: "forward",
        targetGroupArn: httpsGroup.arn,
      },
    ],
  });

  // Attach the listeners to the target groups
  for (let n in nodes) {
    new aws.lb.TargetGroupAttachment(`${n}-http-tg-attachment`, {
      targetGroupArn: httpGroup.arn,
      targetId: nodes[n].nodeId,
      port: 32120,
    });

    new aws.lb.TargetGroupAttachment(`${n}-https-tg-attachment`, {
      targetGroupArn: httpsGroup.arn,
      targetId: nodes[n].nodeId,
      port: 32130,
    });
  }

  return loadBalancer;
}

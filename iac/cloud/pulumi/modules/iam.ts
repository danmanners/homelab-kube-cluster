import * as aws from "@pulumi/aws";

/* The node policy does everything below
  Create IAM Policiess
  - TODO: S3 Read/Write 
*/

export function iamCreation(config: any) {
  const nodePolicy = new aws.iam.Policy("kubeNodePolicies", {
    path: "/",
    description: "Policy for kube Kubernetes Nodes",
    policy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        // AWS ECR - Pull Image Permissions
        {
          Effect: "Allow",
          Action: [
            "ecr:GetAuthorizationToken",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetDownloadUrlForLayer",
            "ecr:GetRepositoryPolicy",
            "ecr:DescribeRepositories",
            "ecr:ListImages",
            "ecr:DescribeImages",
            "ecr:BatchGetImage",
            "ecr:GetLifecyclePolicy",
            "ecr:GetLifecyclePolicyPreview",
            "ecr:ListTagsForResource",
            "ecr:DescribeImageScanFindings",
          ],
          Resource: "*",
        },
        // AWS VPC CNI - https://github.com/aws/amazon-vpc-cni-k8s/blob/master/docs/iam-policy.md
        {
          Effect: "Allow",
          Action: [
            "ec2:AssignPrivateIpAddresses",
            "ec2:AttachNetworkInterface",
            "ec2:CreateNetworkInterface",
            "ec2:DeleteNetworkInterface",
            "ec2:DescribeTags",
            "ec2:DescribeNetworkInterfaces",
            "ec2:DescribeInstanceTypes",
            "ec2:DetachNetworkInterface",
            "ec2:ModifyNetworkInterfaceAttribute",
            "ec2:UnassignPrivateIpAddresses",
          ],
          Resource: "*",
        },
        {
          Effect: "Allow",
          Action: ["ec2:CreateTags"],
          Resource: ["arn:aws:ec2:*:*:network-interface/*"],
        },
        // Cert-Manager - https://cert-manager.io/docs/configuration/acme/dns01/route53/
        {
          Effect: "Allow",
          Action: "route53:GetChange",
          Resource: "arn:aws:route53:::change/*",
        },
        {
          Effect: "Allow",
          Action: [
            "route53:ChangeResourceRecordSets",
            "route53:ListResourceRecordSets",
          ],
          Resource: "arn:aws:route53:::hostedzone/*",
        },
        {
          Effect: "Allow",
          Action: "route53:ListHostedZonesByName",
          Resource: "*",
        },
        // External DNS - https://aws.amazon.com/premiumsupport/knowledge-center/eks-set-up-externaldns/
        {
          Effect: "Allow",
          Action: ["route53:ChangeResourceRecordSets"],
          Resource: ["arn:aws:route53:::hostedzone/*"],
        },
        {
          Effect: "Allow",
          Action: ["route53:ListHostedZones", "route53:ListResourceRecordSets"],
          Resource: "*",
        },
        // AWS Load Balancer Controller - https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/5634fa2e1ab417a9a0167a1d561b04523f2965ff/docs/install/iam_policy.json
        {
          Effect: "Allow",
          Action: ["iam:CreateServiceLinkedRole"],
          Resource: "*",
          Condition: {
            StringEquals: {
              "iam:AWSServiceName": "elasticloadbalancing.amazonaws.com",
            },
          },
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
            "elasticloadbalancing:DescribeTags",
          ],
          Resource: "*",
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
            "shield:DeleteProtection",
          ],
          Resource: "*",
        },
        {
          Effect: "Allow",
          Action: [
            "ec2:AuthorizeSecurityGroupIngress",
            "ec2:RevokeSecurityGroupIngress",
          ],
          Resource: "*",
        },
        {
          Effect: "Allow",
          Action: ["ec2:CreateSecurityGroup"],
          Resource: "*",
        },
        {
          Effect: "Allow",
          Action: ["ec2:CreateTags"],
          Resource: "arn:aws:ec2:*:*:security-group/*",
          Condition: {
            StringEquals: {
              "ec2:CreateAction": "CreateSecurityGroup",
            },
            Null: {
              "aws:RequestTag/elbv2.k8s.aws/cluster": "false",
            },
          },
        },
        {
          Effect: "Allow",
          Action: ["ec2:CreateTags", "ec2:DeleteTags"],
          Resource: "arn:aws:ec2:*:*:security-group/*",
          Condition: {
            Null: {
              "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
              "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
            },
          },
        },
        {
          Effect: "Allow",
          Action: [
            "ec2:AuthorizeSecurityGroupIngress",
            "ec2:RevokeSecurityGroupIngress",
            "ec2:DeleteSecurityGroup",
          ],
          Resource: "*",
          Condition: {
            Null: {
              "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
            },
          },
        },
        {
          Effect: "Allow",
          Action: [
            "elasticloadbalancing:CreateLoadBalancer",
            "elasticloadbalancing:CreateTargetGroup",
          ],
          Resource: "*",
          Condition: {
            Null: {
              "aws:RequestTag/elbv2.k8s.aws/cluster": "false",
            },
          },
        },
        {
          Effect: "Allow",
          Action: [
            "elasticloadbalancing:CreateListener",
            "elasticloadbalancing:DeleteListener",
            "elasticloadbalancing:CreateRule",
            "elasticloadbalancing:DeleteRule",
          ],
          Resource: "*",
        },
        {
          Effect: "Allow",
          Action: [
            "elasticloadbalancing:AddTags",
            "elasticloadbalancing:RemoveTags",
          ],
          Resource: [
            "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
            "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
            "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*",
          ],
          Condition: {
            Null: {
              "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
              "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
            },
          },
        },
        {
          Effect: "Allow",
          Action: [
            "elasticloadbalancing:AddTags",
            "elasticloadbalancing:RemoveTags",
          ],
          Resource: [
            "arn:aws:elasticloadbalancing:*:*:listener/net/*/*/*",
            "arn:aws:elasticloadbalancing:*:*:listener/app/*/*/*",
            "arn:aws:elasticloadbalancing:*:*:listener-rule/net/*/*/*",
            "arn:aws:elasticloadbalancing:*:*:listener-rule/app/*/*/*",
          ],
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
            "elasticloadbalancing:DeleteTargetGroup",
          ],
          Resource: "*",
          Condition: {
            Null: {
              "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
            },
          },
        },
        {
          Effect: "Allow",
          Action: [
            "elasticloadbalancing:RegisterTargets",
            "elasticloadbalancing:DeregisterTargets",
          ],
          Resource: "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
        },
        {
          Effect: "Allow",
          Action: [
            "elasticloadbalancing:SetWebAcl",
            "elasticloadbalancing:ModifyListener",
            "elasticloadbalancing:AddListenerCertificates",
            "elasticloadbalancing:RemoveListenerCertificates",
            "elasticloadbalancing:ModifyRule",
          ],
          Resource: "*",
        },
      ],
    }),
  });

  const nodePolicyExtra = new aws.iam.Policy("nodePolicyExtras", {
    path: "/",
    description: "Policy for kube Kubernetes Nodes",
    policy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        // https://kubernetes.github.io/cloud-provider-aws/prerequisites/
        {
          Effect: "Allow",
          Action: [
            "autoscaling:DescribeAutoScalingGroups",
            "autoscaling:DescribeLaunchConfigurations",
            "autoscaling:DescribeTags",
            "ec2:DescribeInstances",
            "ec2:DescribeRegions",
            "ec2:DescribeRouteTables",
            "ec2:DescribeSecurityGroups",
            "ec2:DescribeSubnets",
            "ec2:DescribeVolumes",
            "ec2:CreateSecurityGroup",
            "ec2:CreateTags",
            "ec2:CreateVolume",
            "ec2:ModifyInstanceAttribute",
            "ec2:ModifyVolume",
            "ec2:AttachVolume",
            "ec2:AuthorizeSecurityGroupIngress",
            "ec2:CreateRoute",
            "ec2:DeleteRoute",
            "ec2:DeleteSecurityGroup",
            "ec2:DeleteVolume",
            "ec2:DetachVolume",
            "ec2:RevokeSecurityGroupIngress",
            "ec2:DescribeVpcs",
            "elasticloadbalancing:AddTags",
            "elasticloadbalancing:AttachLoadBalancerToSubnets",
            "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
            "elasticloadbalancing:CreateLoadBalancer",
            "elasticloadbalancing:CreateLoadBalancerPolicy",
            "elasticloadbalancing:CreateLoadBalancerListeners",
            "elasticloadbalancing:ConfigureHealthCheck",
            "elasticloadbalancing:DeleteLoadBalancer",
            "elasticloadbalancing:DeleteLoadBalancerListeners",
            "elasticloadbalancing:DescribeLoadBalancers",
            "elasticloadbalancing:DescribeLoadBalancerAttributes",
            "elasticloadbalancing:DetachLoadBalancerFromSubnets",
            "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
            "elasticloadbalancing:ModifyLoadBalancerAttributes",
            "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
            "elasticloadbalancing:SetLoadBalancerPoliciesForBackendServer",
            "elasticloadbalancing:CreateListener",
            "elasticloadbalancing:CreateTargetGroup",
            "elasticloadbalancing:DeleteListener",
            "elasticloadbalancing:DeleteTargetGroup",
            "elasticloadbalancing:DescribeListeners",
            "elasticloadbalancing:DescribeLoadBalancerPolicies",
            "elasticloadbalancing:DescribeTargetGroups",
            "elasticloadbalancing:DescribeTargetHealth",
            "elasticloadbalancing:ModifyListener",
            "elasticloadbalancing:ModifyTargetGroup",
            "elasticloadbalancing:RegisterTargets",
            "elasticloadbalancing:DeregisterTargets",
            "elasticloadbalancing:SetLoadBalancerPoliciesOfListener",
            "iam:CreateServiceLinkedRole",
            "kms:DescribeKey",
          ],
          Resource: ["*"],
        },
        {
          Effect: "Allow",
          Action: [
            "ec2:DescribeInstances",
            "ec2:DescribeRegions",
            "ecr:GetAuthorizationToken",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetDownloadUrlForLayer",
            "ecr:GetRepositoryPolicy",
            "ecr:DescribeRepositories",
            "ecr:ListImages",
            "ecr:BatchGetImage",
          ],
          Resource: "*",
        },
      ],
    }),
  });

  // Create IAM Role
  const kubeNodeRole = new aws.iam.Role("kubeNodeRole", {
    assumeRolePolicy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Sid: "",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
        },
      ],
    }),
    tags: Object.assign({}, config.tags, { Name: "kube-node-role" }),
  });

  // Associcate IAM to Role
  new aws.iam.RolePolicyAttachment("kubeCustomPolicyAttachment", {
    role: kubeNodeRole.name,
    policyArn: nodePolicy.arn,
  });

  // Associcate IAM Extras to Role
  new aws.iam.RolePolicyAttachment("extraKubeCustomPolicyAttachment", {
    role: kubeNodeRole.name,
    policyArn: nodePolicyExtra.arn,
  });

  // Associcate IAM to Role
  const ebspolicyattach = new aws.iam.RolePolicyAttachment(
    "kubeEBSPolicyAttachment",
    {
      role: kubeNodeRole.name,
      policyArn:
        "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy",
    }
  );

  // Create the IAM Instance Profile
  const iamInstanceProfile = new aws.iam.InstanceProfile(
    "kubeInstanceProfile",
    {
      role: kubeNodeRole.name,
    }
  );

  return {
    iamInstanceProfile: iamInstanceProfile,
    kubeNodeRole: kubeNodeRole,
  };
}

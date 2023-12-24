import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

function userDataEval(nodeConfig: any, user_data?: null | string) {
  let userData: any = null;
  // Check User-Data
  if (user_data == null) {
    userData = null;
  }
  if (user_data != null) {
    userData = user_data + `hostname: ${nodeConfig.name}`;
  }
  return userData;
}

export function createInstance(
  nodeConfig: any,
  region: string,
  amis: any,
  subnet: pulumi.Output<string>,
  security_group_ids: Array<pulumi.Output<string>>,
  iamInstanceProfile: pulumi.Output<string>,
  user_data?: null | string,
  tags?: any
) {
  // Create the talos Control Plane & associate the role
  const node = new aws.ec2.Instance(`${nodeConfig.name}`, {
    ami: amis[region][`masters_${nodeConfig.arch}`],
    instanceType: nodeConfig.instance_size,

    // Networking
    subnetId: subnet,
    sourceDestCheck: false,
    privateIp: nodeConfig.privateIp,
    vpcSecurityGroupIds: security_group_ids,
    privateDnsNameOptions: {
      enableResourceNameDnsARecord: true,
      hostnameType: "resource-name",
    },

    // Storage
    rootBlockDevice: {
      deleteOnTermination: true,
      volumeType: nodeConfig.root_volume_type,
      volumeSize: nodeConfig.root_volume_size,
    },

    // IAM Instance Profile
    iamInstanceProfile: iamInstanceProfile,
    // Instance Metadata Options
    metadataOptions: {
      httpPutResponseHopLimit: 4,
      httpEndpoint: "enabled",
    },

    // Tags
    tags: Object.assign({}, tags, { Name: nodeConfig.name }),
    volumeTags: Object.assign({}, tags, { Name: nodeConfig.name }),

    // Cloud-Init - SSH Load
    userData: userDataEval(nodeConfig, user_data),
  });

  return {
    privateIp: node.privateIp,
    nodeArn: node.arn,
    nodeId: node.id,
  };
}

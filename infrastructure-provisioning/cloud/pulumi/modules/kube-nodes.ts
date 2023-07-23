import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export function controlPlane(
  nodeConfig: any,
  region: string,
  amis: any,
  tags: any,
  subnet: pulumi.Output<string>,
  security_group_ids: Array<pulumi.Output<string>>,
  iamInstanceProfile: pulumi.Output<string>,
  user_data?: null | string
) {
  let userData: any = null;
  // Check User-Data
  if (user_data == null) {
    userData = null;
  }
  if (user_data != null) {
    userData = user_data + `hostname: ${nodeConfig.name}`;
  }

  // Create the talos Control Plane & associate the role
  const kubeControlPlane = new aws.ec2.Instance(
    `kubecontrolplane-${nodeConfig.name}`,
    {
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
      },

      // Tags
      tags: Object.assign({}, tags, { Name: nodeConfig.name }),
      volumeTags: Object.assign({}, tags, { Name: nodeConfig.name }),

      // Cloud-Init - SSH Load
      userData: userData,
    }
  );

  return {
    privateIp: kubeControlPlane.privateIp,
  };
}

export function worker(
  nodeConfig: any,
  region: string,
  amis: any,
  tags: any,
  subnet: pulumi.Output<string>,
  security_group_ids: Array<pulumi.Output<string>>,
  iamInstanceProfile: pulumi.Output<string>,
  user_data?: string | null
) {
  let userData: any = null;
  // Check User-Data
  if (user_data == null) {
    userData = null;
  }
  if (user_data != null) {
    userData = user_data + `hostname: ${nodeConfig.name}`;
  }

  // Create the talos Control Plane & associate the role
  const kubeworker = new aws.ec2.Instance(`kubeworker-${nodeConfig.name}`, {
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
    },

    // Tags
    tags: Object.assign({}, tags, { Name: nodeConfig.name }),
    volumeTags: Object.assign({}, tags, { Name: nodeConfig.name }),

    // Cloud-Init - SSH Load
    userData: userData,
  });

  return {
    privateIp: kubeworker.privateIp,
  };
}

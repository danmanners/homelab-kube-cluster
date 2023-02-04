import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"

export function controlPlane(
  config: any,
  private_subnets: pulumi.Output<string>,
  security_group_ids: Array<pulumi.Output<string>>,
  iamInstanceProfile: pulumi.Output<string>,
  user_data: string,
) {

  // Create the talos Control Plane & associate the role
  const kubeControlPlane = new aws.ec2.Instance("kubecontrolplane", {
    ami: config.amis[config.cloud_auth.aws_region].masters_arm64,
    instanceType: config.compute.control_planes[0].instance_size,

    // Networking
    subnetId: private_subnets,
    sourceDestCheck: false,
    privateIp: config.compute.control_planes[0].privateIp,
    vpcSecurityGroupIds: security_group_ids,
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
    iamInstanceProfile: iamInstanceProfile,

    // Tags
    tags: Object.assign({},
      config.tags, { Name: "kubecontrolplane" }
    ),
    volumeTags: Object.assign({},
      config.tags, { Name: "kubecontrolplane" }
    ),

    // Cloud-Init - SSH Load
    userData: user_data
  })

  return {
    "privateIp": kubeControlPlane.privateIp
  }

}

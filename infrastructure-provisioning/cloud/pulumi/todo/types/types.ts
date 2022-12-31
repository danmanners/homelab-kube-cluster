import * as pulumi from "@pulumi/pulumi"

export type NetworkingPreview = {
  // Creating VPC
  vpc: {
    arn: pulumi.Output<string>
    id: pulumi.Output<string>
    name: pulumi.Output<string>
  }
  // Public Subnets
  public_subnets: { [name: string]: { id: pulumi.Input<string> } }
  // Private Subnets
  private_subnets: { [name: string]: { id: pulumi.Input<string> } }
}

export type Node = {
  name: string
  instance_size: string
  subnet_name: string
  root_volume_size: number
}

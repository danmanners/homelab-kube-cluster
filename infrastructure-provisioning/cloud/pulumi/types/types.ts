import * as pulumi from "@pulumi/pulumi"

export type NameIdOutputs = {
  [name: string]: {
    id: pulumi.Output<string>,
    routeTableRoute?: pulumi.Output<string>,
  }
}

// Route Table Layouts
export type keyPulumiValue = {
  [name: string]: pulumi.Output<string>
}

// Typeing for Compute Nodes
export type Node = {
  name: string
  instance_size: string
  arch: string,
  subnet_name: string
  root_volume_size: number
  root_volume_type: string,
  privateIp?: string | undefined
}

export type Tags = {
  [name: string]: string
}

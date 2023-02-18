import * as pulumi from "@pulumi/pulumi"
import { Node, NetworkingPreview } from "../types/types"

export function subnetEval(
  node: Node,
  networking: NetworkingPreview): {
    name: {id: pulumi.Output<string>}
  }[] {
  // Define subnetId
  let subnetId: pulumi.Input<string> | undefined
  // Check if we're doing private subnets
  if (networking.private_subnets[node.subnet_name] !== undefined) {
    subnetId = networking.private_subnets[node.subnet_name].id
  }
  // Check if we're doing public subnets
  if (networking.public_subnets[node.subnet_name] !== undefined) {
    subnetId = networking.public_subnets[node.subnet_name].id
  }
  // If subnetId isn't definied, throw an error and die
  if (subnetId == undefined) {
    throw new Error("shouldn't happen")
  }
  // Return the appropriate subnetId
  return subnetId
}
import * as aws from "@pulumi/aws"

// Get the latest Ubuntu AMI
export async function getUbuntuAmi() {
  const ubuntuAmi = aws.ec2.getAmi({
    mostRecent: true,
    filters: [
      {
        name: "name",
        values: ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"],
      },
      {
        name: "virtualization-type",
        values: ["hvm"],
      },
    ],
    owners: ["099720109477"],
  })
  return ubuntuAmi
}
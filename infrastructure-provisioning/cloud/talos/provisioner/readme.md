# Cloud Infrastructure Talos Cluster Provisioner

The purpose of this container is to provision the entirety of a Talos cluster from inside the network with zero interaction from a user.

This shit should be [idempotent](https://www.google.com/search?q=idempotent).

## Build steps

From this directory, we can login, build, and push the container using the following commands:

```bash
# Get the Short SHA for the current Git Commit
export SHORTSHA="$(git rev-parse --short HEAD)"

# Log into the ECR
aws ecr get-login-password --region us-east-1 | \
    podman login --username AWS --password-stdin \
    977656673179.dkr.ecr.us-east-1.amazonaws.com

# Build the Container
podman build --squash -t \
    977656673179.dkr.ecr.us-east-1.amazonaws.com/homelab-provisioning:v0.0.1-${SHORTSHA:-latest} .

# Push the Container to ECR
podman push \
    977656673179.dkr.ecr.us-east-1.amazonaws.com/homelab-provisioning:v0.0.1-${SHORTSHA:-latest}
```

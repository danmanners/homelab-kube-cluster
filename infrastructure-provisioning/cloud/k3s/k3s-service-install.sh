#!/bin/bash
# This script MUST be run as root
# Set the purpose and version of the k3s binary and service to install
k3sPurpose="${1:-agent}"
k3sVersion="${2:-v1.26.0+k3s2}"

# Service File Location
svcLocal="/etc/systemd/system/k3s.service"

# Determine Platform Architecture and set the download name
if [ "$(uname -p)" == "x86_64" ]; then
    binaryName="k3s"
elif [ "$(uname -p)" == "aarch64" ]; then
    binaryName="k3s-arm64"
fi

# Install the K3s Binary
curl -sLo /usr/local/bin/k3s https://github.com/k3s-io/k3s/releases/download/${k3sVersion}/${binaryName}
chmod a+x /usr/local/bin/k3s

# Install the K3s Service
curl -sLo ${svcLocal} https://raw.githubusercontent.com/k3s-io/k3s/${k3sVersion}/k3s.service

# If we're setting up the agent, let's swap the value in the downloaded service file
if [ "$k3sPurpose" == 'agent']; then
    sed 's/server/agent/g' ${svcLocal}
fi

# Install the config file
mkdir -p /etc/rancher/k3s



# Enable the service and start k3s
systemctl daemon-reload
systemctl enable --now k3s

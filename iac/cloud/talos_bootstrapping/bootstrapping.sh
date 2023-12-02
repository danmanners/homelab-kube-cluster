# # Set the URL we'll hit twice
# export url="http://169.254.169.254/latest/meta-data/iam/security-credentials"

# # Generate the Token
# export TOKEN=$(curl -sXPUT \
#     "http://169.254.169.254/latest/api/token" \
#     -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

# # Generate our AWS Credentials
# curl -sH "X-aws-ec2-metadata-token: $TOKEN" ${url}/$(curl -s ${url}) >/tmp/creds.json

# # Configure our AWS Credentials
# mkdir -p ~/.aws/
# cat <<EOF >~/.aws/credentials
# [default]
# aws_access_key_id=$(cat /tmp/creds.json | jq -r '.AccessKeyId')
# aws_secret_access_key=$(cat /tmp/creds.json | jq -r '.SecretAccessKey')
# region=us-east-1
# EOF

# Clone the homelab repo
git clone \
    --depth 1 \
    --branch feature/restructure \
    https://github.com/danmanners/homelab-kube-cluster.git \
    /tmp/homelab-kube-cluster

# Change to the repo directory and Build the Talos Configs
cd /tmp/homelab-kube-cluster/iac/cloud/talos
sops -d -i talsecret.sops.yaml
talhelper genconfig

# Check if the cluster has already been deployed
if $(talosctl --talosconfig clusterconfig/talosconfig -n 172.29.8.5 kubeconfig /tmp/kubeconfig); then
    DEPLOYED="True"
else
    DEPLOYED="False"
fi

# Loop through the files in the talos directory, and perform different tasks for the first file and all subsequent files
for FILE in $(ls -1 clusterconfig/*.yaml); do
    # Get the network interface we'll be provisioning
    TARGET_IP=$(cat ${FILE} |
        yq -r '.machine.network.interfaces[0].addresses[0]' |
        awk -F'/' '{print $1}')
    # If this is the first file, we need to create the cluster
    if [[ "${FILE}" == "clusterconfig/talos-control-plane-01.cloud.danmanners.com.yaml" && "${DEPLOYED}" == "True" ]]; then
        # Create the cluster
        talosctl --talosconfig clusterconfig/talosconfig \
            apply-config -i -n ${TARGET_IP} -f ${FILE}
        # Bootstrap the cluster
        talosctl --talosconfig clusterconfig/talosconfig \
            bootstrap -n ${TARGET_IP} -e ${TARGET_IP}
    else
        # Apply the latest configs to each cluster node
        talosctl --talosconfig clusterconfig/talosconfig \
            apply-config -i -n ${TARGET_IP} -f ${FILE}
    fi
done

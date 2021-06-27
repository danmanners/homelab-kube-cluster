# Quick Setup

```bash
terraform init
terraform apply -var-file=environment/cloud.tfvars

# Join the hosts to the ZeroTier network
for resource in $(tf output | grep "tpi" | awk '{gsub(/"/, ""); print $1","$3}'| xargs echo -n); do
  # Set your SSH Username below
  SSH_USER="danmanners"

  # Set your Zerotier Network ID below
  ZT_NETID="NOT_REAL_ZEROTIER_ID"

  # Break apart the variables from their comma-separated values
  CLOUD_HOST="$(echo "$resource" | awk -F, '{print $1}')"
  CLOUD_IP="$(echo "$resource" | awk -F, '{print $2}')"

  # Set the hostname for the host
  ssh $SSH_USER@$CLOUD_IP -t "sudo hostnamectl set-hostname --static $CLOUD_HOST"

  # Install Zerotier and join the network
  ssh $SSH_USER@$CLOUD_IP -t "curl -s https://install.zerotier.com | sudo bash && \
  sudo zerotier-cli join $ZT_NETID"

  # Disable the snapd service; this can take up a **TON** of system resources on smaller VMs.
  ssh $SSH_USER@$CLOUD_IP -t "sudo systemctl stop snapd && \
  sudo systemctl disable snapd"

  # Add DNS to the ZeroTier hosts on their ZT interfaces
  ssh $SSH_USER@$CLOUD_IP -t 'sudo systemd-resolve -i $(ip l show | grep zt | awk '\''{gsub(/:/,""); print $2}'\'') --set-dns=10.45.0.1'

  # Install K3s
  ssh $SSH_USER@$CLOUD_IP -t "sudo wget https://github.com/k3s-io/k3s/releases/download/v1.21.0%2Bk3s1/k3s \
    -O /usr/local/bin/k3s && \
    sudo chmod a+x /usr/local/bin/k3s"

  # Finally, copy over the systemd file and set it up
  scp files/k3s-node.service $SSH_USER@$CLOUD_IP:/tmp/k3s-node.service
  ssh $SSH_USER@$CLOUD_IP -t "sudo mv /tmp/k3s-node.service /etc/systemd/system/k3s-node.service && \
  sudo chown root:root /etc/systemd/system/k3s-node.service && \
  sudo systemctl daemon-reload && \
  sudo mkdir -p /etc/rancher/k3s"
done
```

Then, manually SSH to each host and create the `/etc/rancher/k3s/config.yaml` file. Get the Zerotier interface with:

```bash
ip l show | grep zt | awk '{gsub(/:/,""); print "flannel-iface: "$2}'
```

Finally, we can start everything up:

```bash
for resource in $(tf output | grep "tpi" | awk '{gsub(/"/, ""); print $1","$3}'| xargs echo -n); do
  # Set your SSH Username below
  SSH_USER="danmanners"

  # Break apart the variables from their comma-separated values
  CLOUD_HOST="$(echo "$resource" | awk -F, '{print $1}')"
  CLOUD_IP="$(echo "$resource" | awk -F, '{print $2}')"

  # Enable and start the k3s service
  ssh $SSH_USER@$CLOUD_IP -t "sudo systemctl enable --now k3s-node"
done
```

After about 60 seconds, you should see your new hosts from `kubectl get nodes`:

```bash
k get nodes
NAME                STATUS   ROLES                  AGE     VERSION
...
tpi-k3s-do-edge-1   Ready    <none>                 10m     v1.21.0+k3s1
tpi-k3s-do-edge-2   Ready    <none>                 3m49s   v1.21.0+k3s1
...
```

#cloud-config
users:
  - name: ${ssh_users.ssh_username}
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ${ssh_users.ssh_pubkey}

# How to use these files

1. Copy the `control_plane_db.yaml` file to `inventory/$cluster/group_vars/control_plane_db.yaml`
2. Encypt the file so you can keep secrets in it with `ansible-vault encrypt inventory/$cluster/group_vars/control_plane_db.yaml`
3. Edit the file with the command `ansible-vault edit inventory/$cluster/group_vars/control_plane_db.yaml`

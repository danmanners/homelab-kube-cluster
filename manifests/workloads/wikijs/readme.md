# Set up the Postgres Database

> THIS IS NOW BEING DEPLOYED ON A VM WITH DOCKER.
> I'm quite over fighting with Kubernetes and WikiJS issues for this moment.

This can **only** be deployed once the PSQL database is up and going.

## Setting up the Database

The steps involved are documented:

- [Install Postgres](https://techviewleo.com/install-postgresql-13-on-amazon-linux/)
- [Create Users](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e)
- [Allow Remote Access](https://www.bigbinary.com/blog/configure-postgresql-to-allow-remote-connection)

## Create the Secret in Kubernetes Manually

https://kubernetes.io/docs/concepts/configuration/secret/#use-case-pods-with-prod-test-credentials

```bash
kubectl create namespace wikijs
kubectl create secret generic -n wikijs \
    prod-db-secret \
    --from-literal=password='not_the_real_password'
```

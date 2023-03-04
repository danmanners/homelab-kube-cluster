# Pulumi Infrastructure Instantiation

You need to ensure that your `~/.aws/credentials` file is set up with the required values.

```ini
[default]
aws_access_key_id = fakeAccessKey
aws_secret_access_key = fakeSecretKey
region = us-east-1
```

Next, you'll need to make sure that `pulumi` and `yarn` are installed.

```bash
brew install pulumi yarn
# Set up the environment from inside the pulumi directory
yarn
```

You may also want to set up a functions and aliases in your `.bashrc` or `.zshrc` file like this:

```bash
alias plm='pulumi'

function plm-pass() {
    read -s var
    export PULUMI_CONFIG_PASSPHRASE=$var
    unset var
}
```

> If you're a troglodyte who uses FISH, you can use this function instead
```sh
function plm-pass;
    read -s var;
    set -gx PULUMI_CONFIG_PASSPHRASE $var;
    set -e var;
end
```

Next we'll log into our S3 bucket:

```bash
pulumi login s3://danmanners-tfstate # or obviously your own bucket 😃
```

Finally, we can run our Pulumi code with:

```bash
plm up # or `pulumi up`
```

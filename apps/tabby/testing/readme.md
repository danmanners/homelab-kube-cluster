The files in this directory are used exclusively to try to figure out a couple things.

1. The `deployment-test.yaml` file was to figure out if an init-container could optimize the startup and readiness time of Tabby.

2. The `init-script.yaml` file was the script to execute.

3. The `temp.yaml` file was a quick pod used to manually copy over the repo files from a remote system using `kubectl cp`. The pod spins up and goes into a sleep mode in order to have plenty of time to execute the copy command.

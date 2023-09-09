#!bash
for item in $(find . -type d -depth 1 | sort); do
    kustomize build --enable-alpha-plugins --enable-helm $item | kubectl apply -f -
done

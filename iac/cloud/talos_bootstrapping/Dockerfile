# syntax=docker/dockerfile:1.6.0

# Set Args
ARG ALPINE_VERSION=3.18
ARG TALOS_VERSION=v1.6.0
ARG TALHELPER_VERSION=v1.16.1
ARG SOPS_VERSION=v3.8.1
ARG KUBECTL_VERSION=v1.28.4
ARG KUSTOMIZE_VERSION=v5.2.1
ARG HELM_VERSION=v3.13.2

FROM docker.io/library/alpine:${ALPINE_VERSION} AS init
ARG TALOS_VERSION
ARG TALHELPER_VERSION
ARG SOPS_VERSION
ARG KUBECTL_VERSION
ARG KUSTOMIZE_VERSION
ARG HELM_VERSION
# Install SOPS, talosctl, talhelper, kubectl, kustomize, helm, curl, and jq
RUN apk add --no-cache wget tar upx && \
    # Create the init directory we'll use to copy files into the runtime container
    mkdir -p /opt/init && \
    # Determine if this is an amd64 or arm64 system
    export ARCH=$([ "$(uname -m)" = "x86_64" ] && echo amd64 || echo arm64) && \
    echo "Running on ${ARCH} architecture" && \
    # Download the talosctl binary and make it executable
    echo "Installing talosctl version ${TALOS_VERSION}" && \
    wget -qO /opt/init/talosctl https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/talosctl-linux-${ARCH} && \
    chmod +x /opt/init/talosctl && \
    # Download the talhelper binary and make it executable
    echo "Installing talhelper version ${TALHELPER_VERSION}" && \
    wget -qO- https://github.com/budimanjojo/talhelper/releases/download/${TALHELPER_VERSION}/talhelper_linux_${ARCH}.tar.gz | \
    tar -xz -C /opt/init talhelper && \
    # Download the sops binary and make it executable
    echo "Installing sops version ${SOPS_VERSION}" && \
    wget -qO /opt/init/sops https://github.com/getsops/sops/releases/download/${SOPS_VERSION}/sops-${SOPS_VERSION}.linux.${ARCH} && \
    chmod +x /opt/init/sops && \
    # Install the kubectl binary and make it executable
    echo "Installing kubectl version ${KUBECTL_VERSION}" && \
    wget -qO /opt/init/kubectl https://dl.k8s.io/release/$(wget -qO- https://dl.k8s.io/release/stable.txt)/bin/linux/${ARCH}/kubectl && \
    chmod +x /opt/init/kubectl && \
    # Install the kustomize binary and make it executable
    echo "Installing kustomize version ${KUSTOMIZE_VERSION}" && \
    wget -qO- https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2F${KUSTOMIZE_VERSION}/kustomize_${KUSTOMIZE_VERSION}_linux_${ARCH}.tar.gz | tar -xz -C /opt/init && \
    # Install the helm binary and make it executable
    echo "Installing helm version ${HELM_VERSION}" && \
    wget -qO- https://get.helm.sh/helm-${HELM_VERSION}-linux-${ARCH}.tar.gz | tar -xz -C /opt/init --strip-components=1 linux-${ARCH}/helm && \
    chmod +x /opt/init/helm && \
    # Compress the binaries
    upx /opt/init/*

FROM docker.io/library/alpine:${ALPINE_VERSION} AS runtime
# Copy the init directory from the init stage
COPY --from=init /opt/init /opt/init
RUN apk add --no-cache curl jq yq git
ENV PATH="/opt/init:${PATH}"
COPY bootstrapping.sh /opt/init/bootstrapping.sh

# ENTRYPOINT ["/opt/init/bootstrapping.sh"]

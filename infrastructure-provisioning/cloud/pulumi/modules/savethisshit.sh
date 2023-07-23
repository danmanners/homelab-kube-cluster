export APP_PATH="/usr/local/bin"
export ARCH="${ARCH:-amd64}"
export SOPS_VERSION="${SOPS_VERSION:-v3.7.3}"
export KSOPS_VERSION="${KSOPS_VERSION:-4.1.0}"
export KUBECTL_VERSION="${KUBECTL_VERSION:-v1.26.0}"
export HELM_VERSION="${HELM_VERSION:-v3.11.0}"
export KUSTOMIZE_VERSION="${KUSTOMIZE_VERSION:-v4.5.7}"
export TALOSCTL_VERSION="${TALOSCTL_VERSION:-v1.3.2}"
export XDG_CONFIG_HOME="${HOME}/.config/"
export KSOPS_PLUGIN_PATH="${XDG_CONFIG_HOME}/kustomize/plugin/viaduct.ai/v1/ksops/"

curl -fsSL -o ${APP_PATH}/kubectl "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/${ARCH}/kubectl" && chmod +x ${APP_PATH}/kubectl

curl -sL https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2F${KUSTOMIZE_VERSION}/kustomize_${KUSTOMIZE_VERSION}_linux_${ARCH}.tar.gz | tar -zxvf - && mv kustomize ${APP_PATH}/kustomize && chmod +x ${APP_PATH}/kustomize

curl -sLo ${APP_PATH}/sops https://github.com/mozilla/sops/releases/download/${SOPS_VERSION}/sops-${SOPS_VERSION}.linux.${ARCH} && chmod a+x ${APP_PATH}/sops

curl -sLo- https://get.helm.sh/helm-${HELM_VERSION}-linux-${ARCH}.tar.gz | tar -zxvf - && mv linux-${ARCH}/helm /usr/local/bin/helm && rm -rf linux-${ARCH}

mkdir -p ${KSOPS_PLUGIN_PATH} && curl -sL https://github.com/viaduct-ai/kustomize-sops/releases/download/v${KSOPS_VERSION}/ksops_${KSOPS_VERSION}_Linux_x86_64.tar.gz | tar -zxvf - -C ${KSOPS_PLUGIN_PATH} && chown -R root:root ${KSOPS_PLUGIN_PATH}

curl -sLo ${APP_PATH}/talosctl https://github.com/siderolabs/talos/releases/download/${TALOSCTL_VERSION}/talosctl-linux-${ARCH} && chmod +x ${APP_PATH}/talosctl

kubectl version --client && \
kustomize version && \
sops --version && \
talosctl version --client


kubectl run temp-troubleshooting \
  --rm -it -n default \
  --pod-running-timeout 3m \
  --image=docker.io/nicolaka/netshoot:latest \
  --command -- /bin/bash
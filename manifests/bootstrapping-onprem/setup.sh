#!/usr/bin/env bash
function kbaph() {
    kustomize build --enable-alpha-plugins --enable-helm $1
}

function whereami() {
    find $(dirname ${BASH_SOURCE[0]}) -type d -depth 1 | sort
}

function help() {
    # If there is no argument or more than one argument, print usage
    echo "Usage: $0 [build|apply]"
    exit 1
}

# Check if there is only one argument
if [[ $# -eq 1 ]]; then
    for item in $(whereami); do
        if [[ $1 == "build" ]]; then
            echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
            echo "=-=-=-= Rendering $item"
            echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
            kbaph $item
        elif [[ $1 == "apply" ]]; then
            echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
            echo "=-=-=-= Deploying $item"
            echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
            kbaph $item | kubectl apply -f -
        else
            help
        fi
    done
else
    help
fi

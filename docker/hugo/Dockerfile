FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

ARG HUGO_VERSION=0.160.1

LABEL org.opencontainers.image.source=https://github.com/MitI-7/MitI-7.github.io
LABEL org.opencontainers.image.description="Hugo build image for MitI-7.github.io"

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
 && rm -rf /var/lib/apt/lists/*

RUN curl -fL \
    --retry 5 \
    --retry-all-errors \
    --retry-delay 3 \
    -o /tmp/hugo.deb \
    "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb" \
 && apt-get update \
 && apt-get install -y /tmp/hugo.deb \
 && rm /tmp/hugo.deb \
 && rm -rf /var/lib/apt/lists/*
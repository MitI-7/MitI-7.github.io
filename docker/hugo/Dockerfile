FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ARG HUGO_VERSION=0.165.0

LABEL org.opencontainers.image.source=https://github.com/MitI-7/MitI-7.github.io
LABEL org.opencontainers.image.description="Hugo build image for MitI-7.github.io"

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fL \
    --retry 5 \
    --retry-delay 3 \
    -o /tmp/hugo.deb \
    "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb" \
    && echo "b4fab4477743c0f1fcfe85072a71156d78f97e4724f0d8bb3b1b1ff2f53ce3ac  /tmp/hugo.deb" | sha256sum -c - \
    && apt-get update \
    && apt-get install -y /tmp/hugo.deb \
    && rm /tmp/hugo.deb \
    && rm -rf /var/lib/apt/lists/*

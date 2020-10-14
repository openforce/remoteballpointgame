#!/bin/sh

#define the template.
cat  << EOF
job "$JOB_NAME" {

  datacenters = ["dc1"]
  type = "service"

  group "game" {
    count = 1
    network {
      mode = "bridge"
      port "http" {
        to     = 5000
      }
    }

    service {
      port = "http"
      check {
        type     = "http"
        path     = "/"
        interval = "10s"
        timeout  = "2s"
      }
      tags = [
        "traefik.enable=true",
        "traefik.tags=service",
        "traefik.http.routers.ballpointgame-dev.rule=Host(\`$ENDPOINT_URL\`)",
        "traefik.http.routers.ballpointgame-dev.tls=true",
        "traefik.http.routers.ballpointgame-dev.tls.certresolver=letsencrypt",
        "traefik.http.routers.ballpointgame-dev.entrypoints=https",
      ]
    }

    task "game" {
      env {
        ANALYTICS_KEY = "$GA_TRACKING_ID"
      }
      driver = "docker"
      config {
        image = "$CONTAINER_STAGING_TAG"
        auth {
          username = "gitlab+deploy-token-1"
          password = "S9YYABtdTm8nFsNF5h6Y"
        }
      }
      resources {
        cpu    = 500 # MHz
        memory = 256 # MB
      }
    }
  }
}
EOF
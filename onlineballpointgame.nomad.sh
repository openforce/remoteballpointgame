#!/bin/sh

#define the template.
cat  << EOF
job "$JOB_NAME" {

  datacenters = ["dc1"]
  type = "service"

  group "game" {
    count = 1
    task "game" {
      driver = "docker"
      config {
        image = "$CONTAINER_STAGING_TAG"
        auth {
          username = "$CI_DEPLOY_USER"
          password = "$CI_DEPLOY_PASSWORD"
        }
        port_map {
          app = 5000 
        }
        dns_servers = ["10.0.2.3", "10.0.2.4", "10.0.2.5"]
      }
      service {
        port = "app"
        tags = [
          "traefik.enable=true",
          "traefik.tags=service",
          "traefik.http.services.ballpointgame_$STAGE.loadbalancer.sticky.cookie=true",
          "traefik.http.routers.ballpointgame_$STAGE.rule=Host(\`$ENDPOINT_URL\`)",
          "traefik.http.routers.ballpointgame_$STAGE.tls=true",
          "traefik.http.routers.ballpointgame_$STAGE.tls.certresolver=letsencrypt",
          "traefik.http.routers.ballpointgame_$STAGE.entrypoints=https",
        ]
      }
      env {
        ANALYTICS_KEY = "$GA_TRACKING_ID"
      }
      resources {
        cpu    = 1000 # MHz
        memory = 512 # MB
        network {
          mbits = 100
          port "app" {}
        }
      }
    }

  }
}
EOF

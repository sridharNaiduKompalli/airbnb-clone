terraform {
  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.0.0"
    }
  }
}

provider "render" {
  # Requires RENDER_API_KEY environment variable to be set
}

# 1. Provision a PostgreSQL Database (Render Free Tier DB)
resource "render_postgres" "airbnb_db" {
  name        = "airbnb-clone-db"
  plan        = "free"
  region      = "oregon"
  database_name = "airbnb"
  user        = "postgres"
}

# 2. Provision the Express Backend API (Web Service)
resource "render_web_service" "backend_api" {
  name        = "airbnb-clone-backend"
  plan        = "free"
  region      = "oregon"
  start_command = "npm run start"
  
  env_vars = {
    "NODE_ENV"     = "production"
    "PORT"         = "5000"
    "DATABASE_URL" = render_postgres.airbnb_db.connection_string
  }

  repo_details = {
    branch        = "main"
    repo_url      = "https://github.com/your-username/airbnb-clone-devops" # Replace with actual repository
    build_filter  = {
      paths = ["backend/**"]
    }
    root_directory = "backend"
  }
}

# 3. Provision the React Frontend (Static Site)
resource "render_static_site" "frontend_site" {
  name     = "airbnb-clone-frontend"
  plan     = "free"
  publish_directory = "dist"
  build_command = "npm run build"

  env_vars = {
    # Forward the live Backend API URL to Vite's environment
    "VITE_API_URL" = render_web_service.backend_api.url
  }

  repo_details = {
    branch        = "main"
    repo_url      = "https://github.com/your-username/airbnb-clone-devops" # Replace with actual repository
    build_filter  = {
      paths = ["frontend/**"]
    }
    root_directory = "frontend"
  }
}

# Outputs for deployment reference
output "database_connection" {
  value       = render_postgres.airbnb_db.connection_string
  description = "Connection string for the PostgreSQL database"
  sensitive   = true
}

output "backend_url" {
  value       = render_web_service.backend_api.url
  description = "The URL of the deployed Backend API"
}

output "frontend_url" {
  value       = render_static_site.frontend_site.url
  description = "The URL of the deployed Airbnb clone frontend"
}


# List available commands
default:
    just --list

# Start dev server for local testing
app_dev:
    cd app && vite dev

# Build redistributable application in dist/
app_build:
    cd app && vite build

# Deploy application (requires previous setup)
app_deploy:
    cd app && vite build && ansible-playbook server/deploy.yml

# Start website dev server locally
website_dev:
    cd website && hugo server

# Deploy website changes
website_deploy:
    cd website && hugo && ansible-playbook server/deploy.yml

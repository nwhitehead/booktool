
# List available commands
default:
    just --list

# Start dev server for local testing
app_dev:
    cd app && vite dev

# Build redistributable application in dist/
app_build:
    cd app && vite build

# Start website dev server locally
website_dev:
    cd website && hugo server

# Deploy website changes
website_deploy:
    cd website && hugo && ansible-playbook server/deploy.yml


# List available commands
default:
    just --list

# Start dev server for local testing
dev:
    vite dev

# Build redistributable application in dist/
build:
    vite build    

# Start website dev server locally
website:
    cd website && hugo server

# Deploy website changes
deploy:
    cd website && hugo && ansible-playbook server/deploy.yml

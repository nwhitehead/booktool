
default:
    just --list

# Start dev server for local play
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

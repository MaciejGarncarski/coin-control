up-dev:
    docker compose -f docker-compose.dev.yml up --build

down-dev:
    docker compose -f docker-compose.dev.yml down

up-prod:
    docker compose -f docker-compose.prod.yml up --build --detach

up-prod-local:
    docker compose -f docker-compose.prod.yml up --build
	
down-prod:
    docker compose -f docker-compose.prod.yml down

test:
	docker compose -f docker-compose.test.yml up --build --abort-on-container-exit 
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

test-api:
	docker compose -f docker-compose.test-api.yml --profile once up --build --abort-on-container-exit 

test-api-coverage:
	docker compose -f docker-compose.test-api.yml --profile coverage up --build --abort-on-container-exit 

test-api-watch:
	docker compose -f docker-compose.test-api.yml --profile watch up --build --abort-on-container-exit 

test-web:
	docker compose -f docker-compose.test-web.yml --profile once up --build --abort-on-container-exit 

test-web-coverage:
	docker compose -f docker-compose.test-web.yml --profile coverage up --build --abort-on-container-exit 

test-web-watch:
	docker compose -f docker-compose.test-web.yml --profile watch up --build --abort-on-container-exit 

test-web-watch-coverage:
	docker compose -f docker-compose.test-web.yml --profile watch-coverage up --build --abort-on-container-exit 
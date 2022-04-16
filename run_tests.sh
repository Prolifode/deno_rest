#!/bin/bash

echo "Running tests in docker container..."
docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build --exit-code-from deno-rest --abort-on-container-exit

exit 0

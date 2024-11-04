# Backend

- Services/ : Interfaces for RabbitMQ, ElasticSearch, News API
- Config/ : config for mongo, rabbitmq, elasticsearch
- utils/ : middleware, helper functions, etc.
- models/ : MongoDB models.
- routes/ : logic for API routes.
- data/ : CRUD operations for Users, Articles, comments, etc.

- app.ts : Express app setup
- Server.ts : server start file.
- Would reccomend VS Code TS extensions that explain TS errors.

- package.json

  - dev: use when making changes. rs to restart the server. --transpileOnly is used to speed up the compilation process by avoiding type checking.
  - build: builds ts to js in dist.
  - start: runs the built js files
  - buildnstart: build and runs the built files.

- Dockerfile : for containerizing the backend.
- .dockerignore: when no changes to node_modules but want to rebuild make sure to leave commented for faster build. (docker will use the cached node_modules). If made changes to node_modules make sure to uncomment to cache the new node_modules.
- Install Docker Desktop for WSL: https://docs.docker.com/desktop/wsl/
- Install on Mac: https://docs.docker.com/desktop/install/mac-install/
- Would have a seperate Dockerfile for mongo, redis, RabbitMQ, ElasticSearch, etc. in the services folder eventually
- This ensures that after making changes we can help each other by just building the docker image on our own computers (regardless of windows, mac, linux) and figuring out the issues.

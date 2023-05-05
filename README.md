### Install Dependencies

1. Run `pnpm install`
2. Run `docker pull getmeili/meilisearch:v1.1`

**NOTE**: I tested this project with **node v18.13.0**.

### Prepare data and Make project up

- If there is `data.json` delete it.
- Run `DOCKER_BUILDKIT=1 docker compose up --build` to start Meilisearch service.
- Run `pnpm run load-data` to generate data and load it in meilisearch.
- Check `http://localhost:3000/`.
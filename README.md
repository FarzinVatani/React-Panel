### Install Dependencies

1. Run `pnpm install`
2. Run `docker pull getmeili/meilisearch:v1.1`

**NOTE**: I tested this project with **node v18.13.0**.

### Prepare data

- if you want to create mock data to use for meilisearch use `node data-generator.js` command. You could change the amount of data by changing `NUMBER_OF_ROWS` value in the `data-generator.js` file.
- Put `data.json` in the root of the project. Then run `docker compose up -d`.
- Check if Meilisearch is working successfully.
- Run `node load-data.js` to load the generated json file to Meilisearch.
- You can check if data is loaded or not in `http://localhost:7700/` and select panel.
- if you want the admin and search keys just run `node get-keys.js`

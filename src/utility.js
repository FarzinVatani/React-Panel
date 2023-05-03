import { MeiliSearch } from "meilisearch";

export const client = new MeiliSearch({ host: 'http://localhost:7700', apiKey: '"MASTER_KEY_DEV"' });

export async function getKeys() {
  const keys = await client.getKeys();
  return {
    search: keys["results"][0]["key"],
    admin: keys["results"][1]["key"]
  };
}
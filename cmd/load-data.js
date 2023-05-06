import { MeiliSearch } from "meilisearch";
import panelData from '../data.json' assert {type: 'json'};

const client = new MeiliSearch({ host: 'http://localhost:7700', apiKey: '"MASTER_KEY_DEV"' });
client.index('panel').addDocuments(panelData)
  .then((res) => console.log(res));

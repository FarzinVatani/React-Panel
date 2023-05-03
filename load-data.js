import { client } from './src/utility.js';
import panelData from './data.json' assert {type: 'json'};

client.index('panel').addDocuments(panelData)
  .then((res) => console.log(res));

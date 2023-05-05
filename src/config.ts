import type MeiliSearch from "meilisearch";

export const sortableAttributes = ["id", "name", "date", "total"];
export const filterableAttributes = [
  "id",
  "name",
  "date",
  "total",
  "status",
  "method",
];

export const setConfig = async (client: MeiliSearch) => {
  await client.index("panel").updatePagination({ maxTotalHits: 200000 });

  await client.index("panel").updateSettings({
    filterableAttributes,
    sortableAttributes,
  });
}

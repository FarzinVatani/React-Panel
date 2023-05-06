import { MeiliSearch } from "meilisearch";
import type { Data, DataRow } from "./types";
import type { Dispatch, SetStateAction } from "react";

export const client = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: '"MASTER_KEY_DEV"',
});

export const addDocument = (row: DataRow) => {
  client.index("panel").addDocuments([row]);
};

export const updateDocument = (row: DataRow) => {
  client.index("panel").updateDocuments([row]);
};

type FetchDataParameters = {
  searchFilter: Record<string, string>;
  filterableAttributes: string[];
  searchField: string;
  sort: Record<string, string>;
  page: number;
  setData: Dispatch<SetStateAction<Data>>;
};

export const fetchData = ({
  searchFilter,
  filterableAttributes,
  searchField,
  sort,
  page,
  setData,
}: FetchDataParameters) => {
  const filterQuery = Object.values(searchFilter)
    .map((value, index) => {
      if (!value) return "";
      if (index === 2) {
        const date = new Date(searchFilter.filterDate);
        return `(date >= ${date.getTime()} AND date < ${date.setDate(
          date.getDate() + 1
        )})`;
      }
      return `${filterableAttributes[index]} = "${value}"`;
    })
    .filter((value) => value)
    .join(" AND ");

  client
    .index("panel")
    .search(searchField, {
      sort: [`${sort.column}:${sort.direction}`],
      filter: filterQuery,
      limit: 20,
      offset: 20 * (page - 1),
    })
    .then((result) =>
      setData({
        hits: result["hits"],
        estimatedTotalHits: result["estimatedTotalHits"],
      } as Data)
    );
};

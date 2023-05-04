export function getKeys(): Promise<{
    search: string;
    admin: string;
}>;
export const client: MeiliSearch;
import { MeiliSearch } from "meilisearch";

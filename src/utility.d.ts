export function getKeys(): Promise<{
  search: string;
  admin: string;
}>;
export const client: MeiliSearch;
import { MeiliSearch } from "meilisearch";

export type Status = "Paid" | "Chargeback" | "Pending" | "Expired" | "Failed";
export type Method = "Visa" | "Mastercard" | "Paypal";

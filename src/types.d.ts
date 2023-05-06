import type { Dispatch, SetStateAction } from "react";

export type Status = "Paid" | "Chargeback" | "Pending" | "Expired" | "Failed";
export type Method = "Visa" | "Mastercard" | "Paypal";

export type DataHits = {
  id: number;
  name: string;
  date: string;
  total: number;
  status: Status;
  method: Method;
};

export type Data = {
  hits: DataHits[];
  estimatedTotalHits: number;
}

export type DataRow = { id: string; name: string; date: string; total: number; status: string; method: string };

export type InputStateSetter = Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<number>>;

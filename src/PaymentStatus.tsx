import type { Status } from "./types";

function PaymentStatus({ status }: { status: Status }) {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-green-400 text-green-950 font-black text-xs">
          {status}
        </span>
      );
    case "Chargeback":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-rose-400 text-rose-950 font-black text-xs">
          {status}
        </span>
      );
    case "Pending":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-yellow-400 text-yellow-950 font-black text-xs">
          {status}
        </span>
      );
    case "Expired":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-neutral-400 text-neutral-950 font-black text-xs">
          {status}
        </span>
      );
    case "Failed":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-red-500 text-red-950 font-black text-xs">
          {status}
        </span>
      );
  }
}

export default PaymentStatus;

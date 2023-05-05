import { Method } from "./utility";
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";

const PaymentMethod = ({ method }: { method: Method }) => {
  switch (method) {
    case "Visa":
      return (
        <span className="flex no-wrap items-center">
          <FaCcVisa />
          <span className="ml-2">{method}</span>
        </span>
      );
    case "Mastercard":
      return (
        <span className="flex no-wrap items-center">
          <FaCcMastercard />
          <span className="ml-2">{method}</span>
        </span>
      );
    case "Paypal":
      return (
        <span className="flex no-wrap items-center">
          <FaCcPaypal />
          <span className="ml-2">{method}</span>
        </span>
      );
  }
};

export default PaymentMethod;

import { PAYMENT_METHODS, PAYMENT_STATUS } from "./constants";
import { InputStateSetter } from "./types";

type ModalContentInputParameters = {
  columnShowName: string;
  columnName: string;
  modalGetter: string | number;
  modalSetter: InputStateSetter;
  inputType: "text" | "number" | "date" | "select";
  isDisabled: boolean;
}

function ModalContentInput({ isDisabled, columnName, columnShowName, inputType, modalGetter, modalSetter }: ModalContentInputParameters) {
  let inputTag = (
    <input
      className="border-2 border-neutral-400 rounded-md py-1 px-2"
      type={inputType}
      value={modalGetter}
      onChange={(event) => {
        modalSetter(event.target.value as (string & number));
      }}
      disabled={isDisabled}
    />
  );

  if (inputType === "select") {
    const paymentName = columnName === "status" ? PAYMENT_STATUS : PAYMENT_METHODS;
    inputTag = (
      <select
        className="py-1 px-2 bg-white rounded-md border-2 border-neutral-400"
        value={modalGetter}
        onChange={(event) => {
          modalSetter(event.target.value as (string & number));
        }}
      >
        {["", ...paymentName].map((value) => <option>{value}</option>)}
      </select>
    );
  }

  return (
    <label className="w-full flex justify-between items-center">
      <span className="pr-5">{columnShowName}:</span>
      {inputTag}
    </label>
  );
}

export default ModalContentInput;

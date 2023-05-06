import { MouseEventHandler } from "react";
import ReactDOM from "react-dom";

type ModalType = {
  show: boolean;
  onCloseClick: MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element;
}

function Modal({ show, onCloseClick, children }: ModalType) {
  if (!show) return ReactDOM.createPortal(<></>, document.body);

  return ReactDOM.createPortal(
    <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-20">
      <button
        className="w-full h-full absolute left-0 top-0 bg-neutral-950 opacity-70 -z-10"
        onClick={onCloseClick}
      />
      <div className="flex flex-col bg-white p-4 rounded-md">
        {children}
        <div className="mt-2 w-full">
          <button
            className="bg-red-500 text-red-950 w-full py-2 rounded-md text-md"
            onClick={onCloseClick}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;

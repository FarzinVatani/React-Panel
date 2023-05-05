import ReactDOM from "react-dom";

function Modal({ show, onCloseClick, children }) {
  if (!show) return ReactDOM.createPortal(<></>, document.body);

  return ReactDOM.createPortal(
    <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-20">
      <div
        className="w-full h-full absolute left-0 top-0 bg-neutral-950 opacity-70 -z-10"
        onClick={onCloseClick}
      />
      <div className="flex flex-col bg-white p-4 rounded-md">
        {children}
        <div className="mt-8 w-full">
          <button
            className="bg-red-500 text-red-950 px-4 py-1 rounded-md text-md"
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
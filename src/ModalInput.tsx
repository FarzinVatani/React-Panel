function ModalInput({
  children,
  label,
}: {
  children: JSX.Element;
  label: string;
}) {
  return (
    <label className="w-full flex justify-between items-center">
      <span className="pr-5">{label}:</span>
      {children}
    </label>
  );
}

export default ModalInput;

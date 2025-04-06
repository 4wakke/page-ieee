export function SelectReg(props,disabled) {
  return (
    <select
      className="text-[#000000] w-full px-3 py-2 mt-2 border bg-white"
      disabled={disabled}
      {...props}
    />
  );
}

export default SelectReg;
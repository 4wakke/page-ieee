// eslint-disable-next-line react/prop-types
export function Label({ children, htmlFor }) {
  return (
    <label
      className="block text-sm font-medium text-gray-300"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

export default Label;

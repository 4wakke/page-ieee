// eslint-disable-next-line react/prop-types
export function Container({ children, className }) {
  return <div className={"w-full h-full mx-auto " + className}>{children}</div>;
}

export default Container;

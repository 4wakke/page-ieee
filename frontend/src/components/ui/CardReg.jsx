/* eslint-disable react/prop-types */
export function CardReg({ children, className }) {
  return (
    <div className={"bg-[#2e5ca6] bg-opacity-85 shadow-lg p-6 min-h-screen rounded-lg max-w-5xl mx-auto " + className}> {/* h-auto */}
      {children}
    </div>
  );
};

export default CardReg;
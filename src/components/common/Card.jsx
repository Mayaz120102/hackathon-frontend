export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  ...props
}) {
  const paddingSizes = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-md
        ${paddingSizes[padding]}
        ${
          hover
            ? "hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            : ""
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

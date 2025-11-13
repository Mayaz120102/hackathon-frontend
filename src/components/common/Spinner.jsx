export default function Spinner({
  size = "md",
  className = "",
  color = "blue",
}) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const colors = {
    blue: "border-gray-200 border-t-blue-600",
    green: "border-gray-200 border-t-green-600",
    red: "border-gray-200 border-t-red-600",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}
      />
    </div>
  );
}

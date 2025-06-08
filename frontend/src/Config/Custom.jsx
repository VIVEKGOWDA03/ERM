
  // Helper component for custom Badge
  export const CustomBadge = ({ children, variant, className = "" }) => {
    let baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
    if (variant === "secondary") {
      baseClasses += "bg-gray-100 text-gray-800";
    } else if (variant === "outline") {
      baseClasses += "border border-gray-300 text-gray-700";
    } else {
      // For project status badges
      baseClasses += className; // Use the passed className for specific colors
    }
    return <span className={baseClasses}>{children}</span>;
  };

  // Helper component for custom Card
  export const CustomCard = ({ children, className = "" }) => {
    return (
      <div className={`bg-white p-4 shadow-sm rounded-lg ${className}`}>
        {children}
      </div>
    );
  };

  // Helper component for custom Progress
  export const CustomProgress = ({ value, className = "" }) => {
    return (
      <div
        className={`relative h-2 rounded-full bg-gray-200 overflow-hidden ${className}`}
      >
        <div
          style={{ width: `${value}%` }}
          className={`h-full rounded-full transition-all duration-500 ease-out ${getCapacityColor(
            value
          )}`}
        ></div>
      </div>
    );
  };

    // Function to get color for capacity bar
export  const getCapacityColor = (percentage) => {
    if (percentage > 90) return "bg-red-500"; // Overloaded
    if (percentage > 70) return "bg-yellow-500"; // Nearing capacity
    return "bg-green-500"; // Good capacity
  };
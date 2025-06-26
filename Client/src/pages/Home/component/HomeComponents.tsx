// Badge Component using pure Tailwind

/**
 * Renders a badge for displaying statuses, counts, or other short pieces of information.
 * This component is built using only Tailwind CSS classes for styling.
 *
 * @param children - The content to display within the badge.
 * @param [variant='default'] - The style variant of the badge. Can be 'default', 'secondary', or 'outline'.
 * @param [className] - Optional additional CSS classes to apply to the badge element.
 */
export const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}) => {
  const variantClasses = {
    default: "bg-blue-500 text-white",
    secondary: "bg-gray-100 text-gray-700",
    outline: "border border-gray-200 text-gray-600 bg-white",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Card Components using pure Tailwind

/**
 * A flexible container component for grouping related content.
 * It provides a basic card layout with a background, rounded corners, and a shadow,
 * styled purely with Tailwind CSS.
 *
 * @param children - The content to be rendered inside the card. Typically `CardContent` or other elements.
 * @param [className] - Optional additional CSS classes to apply to the card's root div.
 */
export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

/**
 * A component designed to wrap the main content within a Card.
 * It's primarily responsible for applying consistent internal padding.
 * Best used as a direct child of the `Card` component.
 *
 * @param children - The main content of the card.
 * @param [className] - Optional additional CSS classes to apply to the content container.
 */
export const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 ${className}`}>{children}</div>;

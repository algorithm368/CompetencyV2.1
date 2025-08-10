// Shared avatar utility to ensure consistent colors across components
export const getInitialAvatar = (name: string) => {
  const initial = name.charAt(0).toUpperCase();
  const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#3F51B5",
    "#2196F3",
    "#009688",
    "#4CAF50",
    "#FF9800",
    "#795548",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return { initial, color };
};

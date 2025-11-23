export const borderClasses = {
  selected: "border-4 border-blue-500",
  movable: "border-4 border-green-500",
  checked: "border-4 border-red-500",
  none: "",
} as const;

export const indicatorConfig = {
  checked: { bg: "bg-red-500", text: "체크" },
  selected: { bg: "bg-blue-500", text: "선택" },
  movable: null,
  none: null,
} as const;

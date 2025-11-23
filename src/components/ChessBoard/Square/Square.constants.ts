export const borderClasses = {
  advisedFrom: "border-4 border-green-500",
  advisedTo: "border-4 border-green-700",
  selected: "border-4 border-blue-500",
  movable: "border-4 border-green-500",
  checked: "border-4 border-red-500",
  none: "",
} as const;

export const indicatorConfig = {
  advisedFrom: { bg: "bg-green-500", text: "출발" },
  advisedTo: { bg: "bg-green-700", text: "도착" },
  checked: { bg: "bg-red-500", text: "체크" },
  selected: { bg: "bg-blue-500", text: "선택" },
  movable: null,
  none: null,
} as const;

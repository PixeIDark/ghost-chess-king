export const borderClasses = {
  advisedFrom: "border-4 border-yellow-400",
  advisedTo: "border-4 border-orange-500",
  selected: "border-4 border-blue-500",
  movable: "border-4 border-green-500",
  checked: "border-4 border-red-600",
  none: "",
} as const;

export const indicatorConfig = {
  advisedFrom: { bg: "bg-yellow-400", text: "출발" },
  advisedTo: { bg: "bg-orange-500", text: "도착" },
  checked: { bg: "bg-red-600", text: "체크" },
  selected: { bg: "bg-blue-500", text: "선택" },
  movable: null,
  none: null,
} as const;

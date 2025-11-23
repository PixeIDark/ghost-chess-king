interface Advisors {
  lowAdvisor: number;
  midAdvisor: number;
  highAdvisor: number;
}

interface AdvisorProps {
  advisors: Advisors;
  onRequestAdvice: (advisor: keyof Advisors) => void;
}

const advisorsText = {
  lowAdvisor: "동네형",
  midAdvisor: "프로",
  highAdvisor: "알파고",
} as const;

const advisorsEmoji = {
  lowAdvisor: "👨",
  midAdvisor: "🤵",
  highAdvisor: "🤖",
} as const;

const advisorColors = {
  lowAdvisor: {
    enabled: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400",
    disabled: "bg-gray-600",
  },
  midAdvisor: {
    enabled: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
    disabled: "bg-gray-600",
  },
  highAdvisor: {
    enabled: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
    disabled: "bg-gray-600",
  },
} as const;

function Advisor({ advisors, onRequestAdvice }: AdvisorProps) {
  const advisorsArray = Object.keys(advisors) as (keyof Advisors)[];

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
      <h2 className="mb-4 text-lg font-bold text-gray-100">조언 받기</h2>
      <div className="flex flex-col gap-3">
        {advisorsArray.map((advisorsItem) => (
          <button
            onClick={() => onRequestAdvice(advisorsItem)}
            name={advisorsItem}
            key={advisorsItem}
            disabled={advisors[advisorsItem] === 0}
            className={`group relative overflow-hidden rounded-lg px-4 py-3 font-semibold text-white transition ${
              advisors[advisorsItem] > 0
                ? `cursor-pointer ${advisorColors[advisorsItem].enabled}`
                : `cursor-not-allowed ${advisorColors[advisorsItem].disabled} opacity-50`
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-lg">{advisorsEmoji[advisorsItem]}</span>
                {advisorsText[advisorsItem]}
              </span>
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                {advisors[advisorsItem]}회
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Advisor;
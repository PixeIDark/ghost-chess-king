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

function Advisor({ advisors, onRequestAdvice }: AdvisorProps) {
  const advisorsArray = Object.keys(advisors) as (keyof Advisors)[];

  return (
    <div className="flex flex-col items-center">
      <p>조언</p>
      <div className="flex flex-col gap-4">
        {advisorsArray.map((advisorsItem) => (
          <button
            onClick={() => onRequestAdvice(advisorsItem)}
            name={advisorsItem}
            key={advisorsItem}
            className="w-30 cursor-pointer bg-gray-600 p-2 text-white"
          >
            {advisorsText[advisorsItem] + " 1회 남음"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Advisor;

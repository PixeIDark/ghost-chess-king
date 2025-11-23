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
      <p>조언 받기</p>
      <div className="flex gap-4">
        {advisorsArray.map((advisorsItem) => (
          <button
            onClick={() => onRequestAdvice(advisorsItem)}
            name={advisorsItem}
            key={advisorsItem}
            className="w-20 cursor-pointer bg-amber-100"
          >
            {advisorsText[advisorsItem]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Advisor;

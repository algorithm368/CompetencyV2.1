// components/AdvisorAffiliations.tsx
import React from "react";
import { AffiliationLink } from "../types/advisor.types";

interface AdvisorAffiliationsProps {
  affiliations: AffiliationLink[];
  cardInView: boolean;
}

export const AdvisorAffiliations: React.FC<AdvisorAffiliationsProps> = ({
  affiliations,
  cardInView,
}) => {
  return (
    <div
      className={`w-full mb-8 transform transition-all duration-500 ${
        cardInView ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
      }`}
      style={{
        transitionDelay: cardInView ? "800ms" : "0ms",
      }}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4 text-teal-700">
        สังกัด
      </h3>
      <div className="space-y-2">
        {affiliations.map((affiliation, index) => (
          <a
            key={index}
            href={affiliation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-teal-600 hover:text-teal-800 hover:underline transition-colors text-lg"
          >
            {affiliation.name}
          </a>
        ))}
      </div>
    </div>
  );
};

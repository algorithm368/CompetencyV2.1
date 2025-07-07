

import React from "react";
import { useCareerResults } from "./hooks/useCareerResults";

export function CareerResults() {
  const { results, loading, error } = useCareerResults();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {results.map(({ source, careers }) => (
        <div key={source}>
          <h2>Results from {source.toUpperCase()}</h2>
          {careers.length === 0 ? (
            <p>No careers found.</p>
          ) : (
            <ul>
              {careers.map((career) => (
                <li key={`${source}-${career}`}>
                  {career} <span style={{ color: "gray" }}>({source})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

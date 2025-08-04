import React, { useMemo } from "react";
import { TpqiBaseSection } from "../common/TpqiBaseSection";
import { TpqiOccupationalCard } from "../common/TpqiOccupationalCard";
import { COLOR_SCHEMES } from "../constants/colorSchemes";
import type { TpqiOccupationalProps } from "../types";

export const TpqiOccupationalSection: React.FC<TpqiOccupationalProps> = ({ occupational, overall }) => {
  const filteredOccupational = useMemo(() => {
    return occupational?.filter(occ => occ.name_occupational?.trim()) || [];
  }, [occupational]);

  if (filteredOccupational.length === 0) return null;

  return (
    <TpqiBaseSection
      title="Occupational Areas"
      overall={overall}
      colorScheme={COLOR_SCHEMES.occupational}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {filteredOccupational.map((occ) => (
          <TpqiOccupationalCard
            key={occ.id}
            name={occ.name_occupational}
            colorScheme={{
              accent: COLOR_SCHEMES.occupational.itemAccent,
              border: COLOR_SCHEMES.occupational.itemBorder,
              shadow: COLOR_SCHEMES.occupational.itemShadow,
              decorativeDot: COLOR_SCHEMES.occupational.itemDecorativeDot,
            }}
          />
        ))}
      </div>
    </TpqiBaseSection>
  );
};

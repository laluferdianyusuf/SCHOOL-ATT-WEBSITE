import React from "react";
import { PiSortAscending } from "react-icons/pi";

interface SortProps {
  handle: () => void;
}

export const Sort: React.FC<SortProps> = ({ handle }) => {
  return (
    <button
      onClick={handle}
      className="border rounded-lg border-slate-300 flex flex-row gap-1 items-center px-2 bg-white py-[7px] "
    >
      <PiSortAscending size={15} />
      <p className="text-xs">Sort</p>
    </button>
  );
};

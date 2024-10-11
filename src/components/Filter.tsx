import React from "react";
import { IoFilterOutline } from "react-icons/io5";

interface FilterProps {
  handle: () => void;
}

export const Filter: React.FC<FilterProps> = ({ handle }) => {
  return (
    <button
      onClick={handle}
      className="border rounded-lg border-slate-300 flex flex-row gap-1 items-center px-2 bg-white py-[7px] "
    >
      <IoFilterOutline size={15} />
      <p className="text-xs">Filter</p>
    </button>
  );
};

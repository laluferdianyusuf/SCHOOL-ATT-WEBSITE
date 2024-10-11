import React, { ReactNode } from "react";

interface DropdownOption {
  name: string;
  value: string;
  icon: ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  onSelect: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  return (
    <div className="absolute z-50 bg-white mt-2 shadow-lg rounded-md border border-slate-300 left-0 w-full">
      {options.map(({ name, value, icon }) => (
        <button
          key={value}
          className="text-xs border-b w-full border-b-slate-300 py-2 px-1 text-start flex flex-row gap-[2px] items-center"
          onClick={() => onSelect(value)}
        >
          {icon}
          <p>{name}</p>
        </button>
      ))}
    </div>
  );
};

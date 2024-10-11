import React, { Dispatch, SetStateAction } from "react";
import { InputField } from "./InputField";

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSearch: Dispatch<SetStateAction<string>>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  setSearch,
}) => {
  const toggleReset = () => {
    setSearch("");
  };
  return (
    <div className="">
      <InputField
        placeholder="search here..."
        onChange={onChange}
        name=""
        width=""
        isSearch
        value={value}
        toggleReset={toggleReset}
      />
    </div>
  );
};

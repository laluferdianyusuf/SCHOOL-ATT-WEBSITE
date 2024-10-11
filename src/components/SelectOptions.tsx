import React from "react";
import Select, {
  GroupBase,
  SingleValue,
  StylesConfig,
  ControlProps,
  CSSObjectWithLabel,
} from "react-select";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptionsProps {
  label?: string;
  placeholder?: string;
  handleChange?: (value: SingleValue<SelectOption>) => void;
  options?: SelectOption[];
  isLoading?: boolean;
  values: SelectOption | null;
}

export const SelectOptions: React.FC<SelectOptionsProps> = ({
  label,
  values,
  placeholder,
  handleChange,
  options,
  isLoading,
}) => {
  const customStyles: StylesConfig<
    SelectOption,
    false,
    GroupBase<SelectOption>
  > = {
    control: (
      provided: CSSObjectWithLabel,
      state: ControlProps<SelectOption, false, GroupBase<SelectOption>>
    ) => ({
      ...provided,
      margin: "0px",
      padding: "0px",
      border: state.isFocused ? "1px solid #14b8a6" : "1px solid #cbd5e1",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : undefined,
      "&:hover": {
        borderColor: "#14b8a6",
      },
      fontSize: "12px",
      color: "#0f172a",
      fontWeight: "500",
      minHeight: "33px",
      height: "33px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      maxHeight: "200px",
      overflowY: "auto",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "0px",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#48bb78" : provided.backgroundColor,
      color: state.isSelected ? "#fff" : "#48bb78",
      fontSize: "12px",
      lineHeight: "1rem",
      padding: "8px",
    }),
  };

  return (
    <div className="flex flex-col justify-between w-full">
      <label className="block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <Select
        placeholder={placeholder}
        value={values}
        onChange={handleChange}
        options={options}
        isLoading={isLoading}
        styles={customStyles}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
      />
    </div>
  );
};

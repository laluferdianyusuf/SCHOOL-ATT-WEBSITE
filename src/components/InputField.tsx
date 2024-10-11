import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoEyeOutline, IoEyeOffOutline, IoClose } from "react-icons/io5";

interface InputFieldProps {
  label?: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  name?: string;
  isDisabled?: boolean;
  width?: string;
  isSearch?: boolean;
  toggleReset?: () => void;
  labelStyle?: string;
  style?: string;
}
export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  isDisabled,
  width = "w-full",
  isSearch,
  toggleReset,
  labelStyle,
  style,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${width}`}>
      {label && <label className={`${labelStyle}`}>{label}</label>}
      <div className={`relative flex rounded-lg gap-2 ${width}`}>
        <input
          type={showPassword && type === "password" ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          className={`px-[10px] py-[7px] border rounded-lg border-slate-300 focus:outline-none focus:ring-1 focus:ring-custom-green-1 text-slate-400 text-xs font-medium w-full ${style} ${
            isSearch ? "pl-7 pr-7" : ""
          }`}
          disabled={isDisabled}
        />

        {isSearch && (
          <div className="absolute translate-x-[8px] translate-y-[9px]">
            <CiSearch size={15} color="grey" />
          </div>
        )}

        {toggleReset && value && value!.length > 0 && (
          <button
            className="absolute right-0 rounded-r-lg h-full px-1"
            onClick={toggleReset}
          >
            <IoClose size={15} />
          </button>
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className=" px-2 border border-slate-300 rounded-lg"
          >
            {showPassword ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

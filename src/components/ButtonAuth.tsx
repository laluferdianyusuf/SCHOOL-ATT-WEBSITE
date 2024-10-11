import React, { ReactNode } from "react";

interface ButtonAuthProps {
  children: ReactNode;
  handle: () => void;
  isLogin?: boolean;
}
export const ButtonAuth: React.FC<ButtonAuthProps> = ({
  children,
  handle,
  isLogin = false,
}) => {
  return (
    <button
      type="submit"
      className={`
        ${isLogin ? "hover:bg-custom-green-1" : "hover:bg-red-500"}
        p-2 rounded-[12px] flex flex-row-reverse justify-between items-center w-full bg-transparent text-white font-bold border border-custom-white-1 text-[14px] px-3`}
      onClick={handle}
    >
      {children}
    </button>
  );
};

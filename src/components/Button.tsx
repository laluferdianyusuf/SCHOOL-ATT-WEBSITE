import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  handle: (e: any) => void;
  style?: string;
  disabled?: boolean;
  bgColor?: string;
}
export const Button: React.FC<ButtonProps> = ({
  children,
  handle,
  style,
  disabled,
  bgColor,
}) => {
  return (
    <button onClick={handle} className={`${style}`} disabled={disabled}>
      {children}
    </button>
  );
};

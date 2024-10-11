import React, { Dispatch, SetStateAction } from "react";
import { PiUsersThreeLight, PiGraduationCapLight } from "react-icons/pi";
import { Button } from "./Button";

interface CardProps {
  backgroundColor?: string;
  teacher: number;
  student: number;
  setActiveMenu: Dispatch<SetStateAction<string>>;
}

export const Card: React.FC<CardProps> = ({
  backgroundColor = "bg-custom-white-2",
  teacher,
  student,
  setActiveMenu,
}) => {
  return (
    <div className={`px-5 py-5 rounded-xl ${backgroundColor} w-full`}>
      <div className="flex gap-5 flex-row justify-center">
        <Button
          style=" px-5 py-2 flex flex-row items-center justify-center gap-3 rounded-xl shadow-md bg-white"
          handle={() => setActiveMenu("Teachers")}
        >
          <PiUsersThreeLight size={25} />
          <p>{teacher}</p>
        </Button>
        <Button
          style="px-5 py-2 flex flex-row items-center justify-center gap-3 rounded-xl shadow-md bg-white"
          handle={() => setActiveMenu("Students")}
        >
          <PiGraduationCapLight size={25} />
          <p>{student}</p>
        </Button>
      </div>
    </div>
  );
};

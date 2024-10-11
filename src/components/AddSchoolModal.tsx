import React, { useState } from "react";
import { School } from "../types/types";
import { InputField } from "./InputField";
import { Button } from "./Button";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSchool: ({ name, address, phone }: School) => void;
}

export const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  isOpen,
  onClose,
  onAddSchool,
}) => {
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");

  const handleAddSchool = () => {
    onAddSchool({
      name: schoolName,
      address: schoolAddress,
      phone: schoolPhone,
    });
    setSchoolName("");
    setSchoolAddress("");
    setSchoolPhone("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-3">
        <div>
          <h2 className="text-lg text-center font-semibold">Add School</h2>
          <p className="text-slate-400 text-xs text-center">
            Please enter details of your school
          </p>
        </div>
        <InputField
          label="School Name"
          type="text"
          placeholder="Enter school name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          labelStyle="text-xs"
        />
        <InputField
          label="School Address"
          type="text"
          placeholder="Enter school address"
          value={schoolAddress}
          onChange={(e) => setSchoolAddress(e.target.value)}
          labelStyle="text-xs"
        />
        <InputField
          label="School Number"
          type="text"
          placeholder="Enter school number"
          value={schoolPhone}
          onChange={(e) => setSchoolPhone(e.target.value)}
          labelStyle="text-xs"
        />
        <div className="mt-4 flex justify-center gap-2">
          <Button
            handle={onClose}
            style="bg-gray-200 flex flex-1 p-2 justify-center rounded-lg"
            children="Cancel"
          />
          <Button
            handle={handleAddSchool}
            style="bg-custom-green-1 flex flex-1 p-2 justify-center  rounded-lg text-white"
            children="Submit"
          />
        </div>
      </div>
    </div>
  );
};

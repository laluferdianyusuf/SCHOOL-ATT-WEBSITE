import React, { ChangeEvent, useState } from "react";
import { Student } from "../types/types";
import {
  PiCheckCircleFill,
  PiPencilSimpleFill,
  PiTextAaBold,
  PiWarningFill,
} from "react-icons/pi";
import { FaUserGraduate } from "react-icons/fa";
import { IoAddOutline, IoCalendar } from "react-icons/io5";
import { InputField, NotificationAlert, SelectOptions } from "../components";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateStudent } from "../redux/slicer/studentSlice";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { SingleValue } from "react-select";

interface SelectOption {
  value: string;
  label: string;
}

interface EditStudentDetailsProps {
  selectedStudent: Student | null;
  onBack: () => void;
  onBackToStudent: () => void;
}

export const EditStudentDetails: React.FC<EditStudentDetailsProps> = ({
  selectedStudent,
  onBack,
  onBackToStudent,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [inputStudent, setInputStudent] = useState<Student>({
    address: "",
    birthdate: "",
    gender: "",
    religion: "",
    parentName: "",
    job: "",
    relationship: "",
    parentPhone: "",
  });
  const [selectedBirthdate, setSelectedBirthdate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [selectedGender, setSelectedGender] =
    useState<SingleValue<SelectOption> | null>(null);
  const [selectedReligion, setSelectedReligion] =
    useState<SingleValue<SelectOption> | null>(null);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const formatDate = (date: Date): string => {
    return format(date, "dd MMMM yyyy", { locale: id });
  };

  const handleChangeStudent = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputStudent((prev) => ({ ...prev, [name]: value }));
    console.log(name);

    if (name === "birthdate" && value.trim() === "") {
      setSelectedBirthdate(null);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedBirthdate(date);
    setIsDatePickerOpen(false);
    if (date) {
      const formattedDate = formatDate(date);
      const baseBorn = inputStudent.birthdate!.split(",")[0];
      setInputStudent((prev) => ({
        ...prev,
        birthdate: `${baseBorn}, ${formattedDate}`,
      }));
    }
  };

  const handleSaveChanges = async () => {
    setSuccess("");
    setError("");
    try {
      await dispatch(
        updateStudent({
          id: String(selectedStudent?.id),
          student: {
            address: String(inputStudent.address),
            birthdate: String(inputStudent.birthdate),
            gender: String(selectedGender?.value),
            religion: String(selectedReligion?.value),
            parentName: inputStudent.parentName,
            relationship: inputStudent.relationship,
            job: inputStudent.job,
            parentPhone: inputStudent.parentPhone,
          },
        })
      );
      setSuccess("Changes updated");
      onBack();
      setInputStudent({
        address: "",
        birthdate: "",
        gender: "",
        religion: "",
        parentName: "",
        job: "",
        relationship: "",
        parentPhone: "",
      });
      setSelectedBirthdate(null);
      setSelectedGender(null);
      setSelectedReligion(null);
    } catch (error: any) {
      setError(error.message || "Error updating changes");
    }
  };

  const handleChangeGender = (value: SingleValue<SelectOption>) => {
    setSelectedGender(value);
  };
  const handleChangeReligion = (value: SingleValue<SelectOption>) => {
    setSelectedReligion(value);
  };

  const options = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const religionOptions = [
    { label: "Christianity", value: "Christianity" },
    { label: "Islam", value: "Islam" },
    { label: "Hinduism", value: "Hinduism" },
    { label: "Buddhism", value: "Buddhism" },
    { label: "Confucianism", value: "Confucianism" },
  ];

  return (
    <div className="overflow-auto bg-white h-full rounded-md flex flex-col gap-4 border border-slate-200">
      <div className="border-b-2 border-slate-200 px-5 py-2 flex justify-between items-center">
        <div className="text-sm">
          <ul className="flex gap-3 items-center">
            <li className="">
              <IoAddOutline size={20} color="#4c637d" />
            </li>
            <div className="w-[2px] rounded-full bg-slate-200 h-4" />
            <li className="m-0 p-0">
              <div className="breadcrumbs py-0 text-sm">
                <ul>
                  <li
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={onBackToStudent}
                  >
                    <FaUserGraduate size={15} color="#4c637d" />
                    <p className="text-sm text-slate-500">Students</p>
                  </li>
                  <li
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={onBack}
                  >
                    <PiTextAaBold size={15} color="#4c637d" />
                    <p className="capitalize text-xs text-slate-500">
                      {selectedStudent?.name}
                    </p>
                  </li>
                  <li className="flex items-center gap-2 py-[5.5px]">
                    <PiPencilSimpleFill size={15} color="#0d9485" />
                    <p className="capitalize text-xs text-custom-green-2">
                      Edit
                    </p>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="px-5">
        <h2 className="capitalize font-semibold text-gray-800">
          Update {selectedStudent?.name}'s details
        </h2>
        <p className="text-slate-400 text-xs">
          Here you can edit details about {selectedStudent?.name}.
        </p>
        <p className="text-slate-400 text-xs">
          Please fill in the following information to update the student's
          profile.
        </p>
        <p className="text-slate-400 text-xs">
          Ensure that all required fields are completed accurately, and click
          "Save Changes" when you are done.
        </p>
      </div>

      <div className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-baseline">
        <InputField
          label="Student's address"
          labelStyle="text-xs font-semibold text-gray-700"
          name="address"
          placeholder="Enter student's address"
          value={inputStudent.address}
          onChange={handleChangeStudent}
        />
        <div className="relative">
          <InputField
            label="Student's birthdate"
            labelStyle="text-xs font-semibold text-gray-700"
            name="birthdate"
            placeholder="Enter student's birthdate"
            value={inputStudent.birthdate}
            onChange={handleChangeStudent}
          />
          {inputStudent.birthdate!.trim() !== "" && (
            <>
              <div className="flex items-center gap-2 mt-2 absolute flex-col z-50 top-[18px] right-[2px]">
                <button
                  className="flex items-center px-2 h-7"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                >
                  <IoCalendar size={15} color="#0D9485" />
                </button>
              </div>

              <div className="absolute top-[-10vh] flex z-50">
                {isDatePickerOpen && (
                  <DatePicker
                    selected={selectedBirthdate}
                    onChange={handleDateChange}
                    inline
                    locale="id"
                    dateFormat="dd MMMM yyyy"
                  />
                )}
              </div>
            </>
          )}
        </div>
        <SelectOptions
          values={selectedGender}
          handleChange={handleChangeGender}
          label="Gender"
          placeholder="Select Gender"
          options={options}
        />
        <SelectOptions
          values={selectedReligion}
          handleChange={handleChangeReligion}
          label="Religions"
          placeholder="Select Religions"
          options={religionOptions}
        />
        <InputField
          label="Parent's name"
          labelStyle="text-xs font-semibold text-gray-700"
          name="parentName"
          placeholder="Enter parent's name"
          value={inputStudent.parentName}
          onChange={handleChangeStudent}
        />
        <InputField
          label="Relation"
          labelStyle="text-xs font-semibold text-gray-700"
          name="relationship"
          placeholder="Select Your Relations"
          value={inputStudent.relationship}
          onChange={handleChangeStudent}
        />
        <InputField
          label="Parent's occupation"
          labelStyle="text-xs font-semibold text-gray-700"
          name="job"
          placeholder="Enter parent's occupation"
          value={inputStudent.job}
          onChange={handleChangeStudent}
        />
        <InputField
          label="Parent's phone number"
          labelStyle="text-xs font-semibold text-gray-700"
          name="parentPhone"
          placeholder="Enter parent's phone number"
          value={inputStudent.parentPhone}
          onChange={handleChangeStudent}
        />
      </div>

      <div className="px-5 py-4 flex justify-end gap-4">
        <button
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
          onClick={onBack}
        >
          Cancel
        </button>
        <button
          onClick={handleSaveChanges}
          className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
        >
          Save Changes
        </button>
      </div>

      {success && (
        <NotificationAlert
          icon={<PiCheckCircleFill size={15} color="#47a855" />}
          text={success}
        />
      )}
      {error && (
        <NotificationAlert
          icon={<PiWarningFill size={15} color="#de5757" />}
          text={error}
        />
      )}
    </div>
  );
};

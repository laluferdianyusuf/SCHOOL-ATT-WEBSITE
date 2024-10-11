import React, { ChangeEvent, useState } from "react";
import { Teacher } from "../types/types";
import {
  PiCheckCircleFill,
  PiPencilSimpleFill,
  PiTextAaBold,
  PiWarningFill,
} from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
import { IoAddOutline, IoCalendar } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { SingleValue } from "react-select";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { updateTeacher } from "../redux/slicer/teacherSlice";
import { InputField, NotificationAlert, SelectOptions } from "../components";
import DatePicker from "react-datepicker";

interface SelectOption {
  value: string;
  label: string;
}

interface EditTeacherDetailsProps {
  selectedTeacher: Teacher | null;
  onBack: () => void;
  onBackToTeacher: () => void;
}

export const EditTeacherDetails: React.FC<EditTeacherDetailsProps> = ({
  selectedTeacher,
  onBack,
  onBackToTeacher,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [inputTeacher, setInputTeacher] = useState<Teacher>({
    name: "",
    address: "",
    born: "",
    gender: "",
    religion: "",
    nip: "",
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

  const handleChangeTeacher = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputTeacher((prev) => ({ ...prev, [name]: value }));

    if (name === "born" && value.trim() === "") {
      setSelectedBirthdate(null);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedBirthdate(date);
    setIsDatePickerOpen(false);
    if (date) {
      const formattedDate = formatDate(date);
      const baseBorn = inputTeacher.born!.split(",")[0];
      setInputTeacher((prev) => ({
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
        updateTeacher({
          id: String(selectedTeacher?.id),
          teacher: {
            name: inputTeacher.name,
            address: String(inputTeacher.address),
            born: String(inputTeacher.born),
            gender: String(selectedGender?.value),
            religion: String(selectedReligion?.value),
            nip: inputTeacher.nip,
          },
        })
      );
      setSuccess("Changes updated");
      onBack();
      setInputTeacher({
        name: "",
        address: "",
        born: "",
        gender: "",
        religion: "",
        nip: "",
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
    <div className="overflow-auto no-scrollbar bg-white h-[97vh] rounded-md flex flex-col gap-4 border border-slate-200">
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
                    onClick={onBackToTeacher}
                  >
                    <FaUserTie size={15} color="#4c637d" />
                    <p className="text-sm text-slate-500">Teachers</p>
                  </li>
                  <li
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={onBack}
                  >
                    <PiTextAaBold size={15} color="#4c637d" />
                    <p className="capitalize text-xs text-slate-500">
                      {selectedTeacher?.name}
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
          Update {selectedTeacher?.name}'s details
        </h2>
        <p className="text-slate-400 text-xs">
          Here you can edit details about {selectedTeacher?.name}.
        </p>
        <p className="text-slate-400 text-xs">
          Please fill in the following information to update the teachers's
          profile.
        </p>
        <p className="text-slate-400 text-xs">
          Ensure that all required fields are completed accurately, and click
          "Save Changes" when you are done.
        </p>
      </div>

      <div className="no-scrollbar px-5 flex flex-col w-full gap-3 items-baseline pb-3">
        <InputField
          label="Address"
          labelStyle="text-xs font-semibold text-gray-700"
          name="address"
          placeholder="Enter address"
          value={inputTeacher.address}
          onChange={handleChangeTeacher}
        />
        <div className="relative w-full">
          <InputField
            label="Birthdate"
            labelStyle="text-xs font-semibold text-gray-700"
            name="born"
            placeholder="Enter birthdate"
            value={inputTeacher.born}
            onChange={handleChangeTeacher}
          />
          {inputTeacher.born!.trim() !== "" && (
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
          label="NIP"
          labelStyle="text-xs font-semibold text-gray-700"
          name="parentName"
          placeholder="Enter NIP"
          value={inputTeacher.nip}
          onChange={handleChangeTeacher}
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

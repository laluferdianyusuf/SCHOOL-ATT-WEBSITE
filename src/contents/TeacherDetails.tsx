import React, { useEffect, useState } from "react";
import { Button, Loading } from "../components";
import { IoAddOutline } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { Teacher } from "../types/types";
import { TableDetails } from "../components/TableDetails";
import {
  PiTextAaLight,
  PiMapPinLight,
  PiGenderMaleLight,
  PiGenderFemaleLight,
  PiTextAaBold,
  PiMosqueLight,
  PiCakeLight,
  PiIdentificationCardLight,
  PiPencilSimpleFill,
} from "react-icons/pi";
import { getTeacherById } from "../redux/slicer/teacherSlice";

interface TeacherDetailsProps {
  selectedTeacher: string;
  onBack: () => void;
  handleTeacherSelectToEdit: (data: Teacher) => void;
}

export const TeacherDetails: React.FC<TeacherDetailsProps> = ({
  selectedTeacher,
  onBack,
  handleTeacherSelectToEdit,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (selectedTeacher) {
      fetchTeacher();
    }
  }, [selectedTeacher]);

  const fetchTeacher = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        getTeacherById({ id: selectedTeacher })
      ).unwrap();
      setTeacher(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const teacherItem = [
    { label: "Name", value: teacher?.name, icon: <PiTextAaLight size={15} /> },
    {
      label: "Address",
      value: teacher?.address,
      icon: <PiMapPinLight size={15} />,
    },
    {
      label: "Gender",
      value: teacher?.gender,
      icon: (
        <div className="flex ">
          <PiGenderMaleLight size={15} className="-rotate-45" />
          <PiGenderFemaleLight size={15} />
        </div>
      ),
    },
    {
      label: "Religion",
      value: teacher?.religion,
      icon: <PiMosqueLight size={15} />,
    },
    {
      label: "Birth Date",
      value: teacher?.born,
      icon: <PiCakeLight size={15} />,
    },
    {
      label: "NIP",
      value: teacher?.nip,
      icon: <PiIdentificationCardLight size={15} />,
    },
  ];

  return (
    <div className="overflow-auto h-full bg-white rounded-md flex flex-col gap-4 border border-slate-200">
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
                    className="flex items-center gap-2 cursor-pointer py-[3.5px]"
                    onClick={onBack}
                  >
                    <FaUserTie size={15} color="#4c637d" />
                    <p className="text-sm text-slate-500">Teachers</p>
                  </li>
                  <li className="flex items-center gap-2 py-[5.5px]">
                    <PiTextAaBold size={15} color="#0d9485" />
                    <p className="capitalize text-xs text-custom-green-2">
                      {teacher?.name}
                    </p>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        {/* <div className="flex flex-row items-center gap-2">
          <Button
            style="border rounded-lg border-slate-300 flex flex-row gap-1 items-center px-2 bg-white p-[4.5px]"
            handle={() => console.log("notifications")}
          >
            <IoNotifications size={15} />
          </Button>
          <div className="w-[2px] rounded-full bg-slate-200 h-4" />
          <Button
            style="border rounded-lg border-slate-300 flex flex-row gap-1 items-center px-2 bg-white p-[4.5px]"
            handle={() => console.log("export as PDF")}
          >
            <BiSolidFilePdf size={15} />
            <p className="text-xs">as PDF</p>
          </Button>
        </div> */}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="border-b-2 border-slate-200 pb-5 px-5">
            <div className="mb-3">
              <h1 className="font-bold text-2xl">{teacher?.name}'s Details</h1>
              <p className="text-slate-500 text-xs">
                Manage {teacher?.name + "'s"} details
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-1 items-center">
                <Button
                  style="border rounded-lg border-slate-300 flex flex-row gap-1 items-center px-2 bg-white py-[7px]"
                  handle={() =>
                    handleTeacherSelectToEdit((teacher || null) as Teacher)
                  }
                >
                  <PiPencilSimpleFill size={15} color="#0d9485" />
                  <p className="text-xs">
                    Edit{" "}
                    <span className="capitalize">{teacher?.name + "'s"}</span>{" "}
                    Data
                  </p>
                </Button>
              </div>
            </div>
          </div>
          <div className="px-3 overflow-auto no-scrollbar">
            <TableDetails item={teacherItem} />
          </div>
        </>
      )}
    </div>
  );
};

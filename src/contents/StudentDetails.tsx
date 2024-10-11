import React, { useEffect, useState } from "react";
import { Button, Loading } from "../components";
import { IoAddOutline } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { Attendance, Student } from "../types/types";
import { getStudentById } from "../redux/slicer/studentSlice";
import { TableDetails } from "../components/TableDetails";
import {
  PiBriefcaseLight,
  PiCakeLight,
  PiCaretLeftLight,
  PiCaretRightLight,
  PiChalkboardTeacherLight,
  PiGenderFemaleLight,
  PiGenderMaleLight,
  PiHandshakeLight,
  PiMapPinLight,
  PiMosqueLight,
  PiPencilSimpleFill,
  PiPhoneLight,
  PiTextAaBold,
  PiTextAaLight,
} from "react-icons/pi";
import { RiParentLine } from "react-icons/ri";
import { getAttendancesByWeek } from "../redux/slicer/attendanceSlice";

interface StudentDetailsProps {
  selectedStudent: string;
  onBack: () => void;
  handleStudentSelect: (data: Student) => void;
  handleStudentSelectToEdit: (data: Student) => void;
}

export const StudentDetails: React.FC<StudentDetailsProps> = ({
  selectedStudent,
  onBack,
  handleStudentSelect,
  handleStudentSelectToEdit,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudent();
      fetchAttendances();
    }
  }, [selectedStudent]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        getStudentById({ id: selectedStudent })
      ).unwrap();

      setStudent(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        getAttendancesByWeek({ id: Number(selectedStudent) })
      ).unwrap();

      setAttendances(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const studentItem = [
    {
      label: "Classroom",
      value: student?.classroom,
      icon: <PiChalkboardTeacherLight size={15} />,
    },
    { label: "Name", value: student?.name, icon: <PiTextAaLight size={15} /> },
    {
      label: "Address",
      value: student?.address,
      icon: <PiMapPinLight size={15} />,
    },
    {
      label: "Gender",
      value: student?.gender,
      icon: (
        <div className="flex ">
          <PiGenderMaleLight size={15} className="-rotate-45" />
          <PiGenderFemaleLight size={15} />
        </div>
      ),
    },
    {
      label: "Religion",
      value: student?.religion,
      icon: <PiMosqueLight size={15} />,
    },
    {
      label: "Birth Date",
      value: student?.birthdate,
      icon: <PiCakeLight size={15} />,
    },
    {
      label: "Parent's Name",
      value: student?.parentName,
      icon: <RiParentLine size={15} />,
    },
    {
      label: "Parent's Job",
      value: student?.job,
      icon: <PiBriefcaseLight size={15} />,
    },
    {
      label: "Relation",
      value: student?.relationship,
      icon: <PiHandshakeLight size={15} />,
    },
    {
      label: "Phone",
      value: student?.parentPhone,
      icon: <PiPhoneLight size={15} />,
    },
  ];

  const changeDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const getAttendanceStatus = () => {
    return attendances.filter((att) => {
      const attendanceDate = new Date(att.createdAt!);
      return attendanceDate.toDateString() === currentDate.toDateString();
    });
  };

  return (
    <div className=" bg-white h-[97vh] 2xl:h-[98.2vh] rounded-md flex flex-col gap-4 border border-slate-200">
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
                    <FaUserGraduate size={15} color="#4c637d" />
                    <p className="text-sm text-slate-500">Students</p>
                  </li>
                  <li className="flex items-center gap-2 py-[5.5px]">
                    <PiTextAaBold size={15} color="#0d9485" />
                    <p className="capitalize text-xs text-custom-green-2">
                      {student?.name}
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
              <h1 className="font-bold text-2xl capitalize">
                {student?.name + "'s"} Details
              </h1>
              <p className="text-slate-500 text-xs">
                Manage{" "}
                <span className="capitalize">{student?.name + "'s"}</span>{" "}
                details
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-1 items-center">
                <Button
                  style="border rounded-lg border-slate-300 flex flex-row gap-1 items-center px-2 bg-white py-[7px]"
                  handle={() =>
                    handleStudentSelectToEdit((student || null) as Student)
                  }
                >
                  <PiPencilSimpleFill size={15} color="#0d9485" />
                  <p className="text-xs">
                    Edit{" "}
                    <span className="capitalize">{student?.name + "'s"}</span>{" "}
                    Data
                  </p>
                </Button>
              </div>
            </div>
          </div>
          <div className="px-3 flex gap-3 overflow-auto no-scrollbar pb-5">
            <div className="flex-grow">
              <TableDetails item={studentItem} />
            </div>
            <div className="max-w-xs w-full self-start flex flex-col gap-3">
              <div className="bg-custom-green-3 shadow-md rounded-md px-4 py-2">
                <div className="flex items-center justify-between pb-3">
                  <h3>Attendances</h3>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 bg-custom-green-3 text-custom-green-2"
                      onClick={() => changeDay("prev")}
                    >
                      <PiCaretLeftLight size={15} />
                    </button>
                    <div>{formatDate(currentDate)}</div>
                    <button
                      className="p-1 bg-custom-green-3 text-custom-green-2"
                      onClick={() => changeDay("next")}
                    >
                      <PiCaretRightLight size={15} />
                    </button>
                  </div>
                </div>
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-2 flex-1">
                    <p className="flex-1 text-custom-green-2">Status</p>
                    <div className="w-[2px] rounded-full bg-slate-200 h-4" />
                  </span>

                  <p className="flex-1 border-l border-custom-green-3 capitalize">
                    {getAttendanceStatus()?.length! > 0
                      ? getAttendanceStatus()!
                          .map((att) => att.present)
                          .join(", ")
                      : "no record"}
                  </p>
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-2 flex-1">
                    <p className="flex-1 text-custom-green-2">Timestamp</p>
                    <div className="w-[2px] rounded-full bg-slate-200 h-4" />
                  </span>

                  <p className="flex-1 border-l border-custom-green-3">
                    {getAttendanceStatus()?.length! > 0
                      ? getAttendanceStatus()!
                          .map((att) => att.timestamp)
                          .join(", ")
                      : "no record"}
                  </p>
                </span>
              </div>

              <button
                className="flex gap-3 justify-between bg-custom-green-2 text-white w-full items-center py-1 px-3 rounded-md"
                onClick={() =>
                  handleStudentSelect((student || null) as Student)
                }
              >
                <p>details</p>
                <PiCaretRightLight size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

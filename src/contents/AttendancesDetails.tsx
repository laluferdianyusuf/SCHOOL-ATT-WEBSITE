import React, { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa";
import {
  PiCaretLeft,
  PiCaretRight,
  PiTextAaBold,
  PiUserCheckFill,
} from "react-icons/pi";
import { Attendance, Student } from "../types/types";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { getAttendancesDetails } from "../redux/slicer/attendanceSlice";
import { format } from "date-fns";
import { Loading } from "../components";

interface AttendancesDetailsProps {
  selectedStudent: Student | null;
  onBack: () => void;
  onBackToStudent: () => void;
}

export const AttendancesDetails: React.FC<AttendancesDetailsProps> = ({
  onBackToStudent,
  selectedStudent,
  onBack,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const today = new Date();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [loading, setLoading] = useState<boolean>(true);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (selectedStudent?.schoolId && selectedStudent?.id) {
      fetchAttendances();
    }
  }, [
    selectedStudent?.id,
    selectedStudent?.schoolId,
    currentMonth,
    currentYear,
  ]);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        getAttendancesDetails({
          id: Number(selectedStudent?.schoolId),
          month: months[currentMonth],
          year: String(currentYear),
          studentId: Number(selectedStudent?.id),
        })
      ).unwrap();

      setAttendances(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const formatCreatedAt = (createdAt: string) => {
    return format(new Date(createdAt), "dd MMMM yyyy");
  };

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(`1970-01-01T${timestamp}Z`), "hh:mm a");
  };

  return (
    <div className=" bg-white h-[97vh] 2xl:h-[98.2vh] rounded-md flex flex-col gap-4 border border-slate-200">
      {loading ? (
        <Loading />
      ) : (
        <>
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
                      <li className="flex items-center gap-2">
                        <PiUserCheckFill size={15} color="#0d9485" />
                        <p className="capitalize text-xs text-custom-green-2">
                          Attendances
                        </p>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-md hover:bg-slate-100 text-xs bg-slate-100 text-custom-green-2"
                aria-label="Previous Month"
              >
                <PiCaretLeft />
              </button>

              <div className="w-[2px] rounded-full bg-slate-200 h-4" />
              <div className="flex items-center gap-2">
                <div className="rounded-md px-2 text-xs py-[5.5px] bg-slate-100 text-custom-green-2">
                  {months[currentMonth]}
                </div>
                <div className="w-[2px] rounded-full bg-slate-200 h-4" />
                <div className="rounded-md px-2 text-xs py-[5.5px] bg-slate-100 text-custom-green-2">
                  {currentYear}
                </div>
              </div>
              <div className="w-[2px] rounded-full bg-slate-200 h-4" />
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-md hover:bg-slate-100 text-xs bg-slate-100 text-custom-green-2"
                aria-label="Next Month"
              >
                <PiCaretRight />
              </button>
            </div>
          </div>
          <div className="overflow-auto py-4 px-5 grid md:grid-cols-3 grid-cols-5 gap-2  no-scrollbar">
            {Array.isArray(attendances) &&
              attendances.length > 0 &&
              attendances.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-custom-green-3 px-4 py-2 rounded-md"
                >
                  <div>
                    <p className="capitalize">{item.present}</p>
                    <p className="text-slate-400 text-sm">
                      {formatCreatedAt(String(item.createdAt))}
                    </p>
                  </div>
                  <div>{formatTimestamp(String(item.timestamp))}</div>
                </div>
              ))}
            <div></div>
          </div>
        </>
      )}
    </div>
  );
};

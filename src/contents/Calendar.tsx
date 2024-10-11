import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
import { Admin, Calendar, School, Student, Teacher } from "../types/types";
import { IoAddOutline } from "react-icons/io5";
import {
  PiCalendarDotsFill,
  PiCaretLeft,
  PiCaretRight,
  PiCheckCircleFill,
  PiWarningFill,
} from "react-icons/pi";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import {
  createCalendar,
  getCalendarBySchoolId,
} from "../redux/slicer/calendarSlice";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  getDaysInMonth,
  getDay,
} from "date-fns";
import { ModalCrud } from "../components/ModalCrud";
import { Loading, NotificationAlert } from "../components";

interface CalendarProps {
  student: Student[];
  teacher: Teacher[];
  user: Admin;
  schools: School;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Calendars: React.FC<CalendarProps> = ({ schools }) => {
  const dispatch: AppDispatch = useDispatch();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [inputEvents, setInputEvents] = useState<Calendar>({
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

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
    if (schools.id) {
      fetchCalendars();
    }
  }, [schools.id, currentDate]);

  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        getCalendarBySchoolId({
          id: schools.id!,
          month: months[currentMonth],
          year: currentYear,
        })
      ).unwrap();

      setCalendars(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonthNumber = (month: number, year: number): number => {
    return getDaysInMonth(new Date(year, month));
  };

  const getStartDayOfMonth = (month: number, year: number): number => {
    return getDay(startOfMonth(new Date(year, month)));
  };

  const generateCalendarDates = useMemo((): (number | null)[] => {
    const daysInMonth = getDaysInMonthNumber(currentMonth, currentYear);
    const startDay = getStartDayOfMonth(currentMonth, currentYear);
    const calendarDates: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      calendarDates.push(null);
    }

    for (let date = 1; date <= daysInMonth; date++) {
      calendarDates.push(date);
    }

    while (calendarDates.length % 7 !== 0) {
      calendarDates.push(null);
    }

    return calendarDates;
  }, [currentMonth, currentYear]);

  const calendarDates = generateCalendarDates;

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const formatSelectedDate = (date: number): string => {
    const selectedDate = new Date(currentYear, currentMonth, date);
    const formattedDate = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(date).padStart(2, "0")} ${String(
      selectedDate.getHours()
    ).padStart(2, "0")}:${String(selectedDate.getMinutes()).padStart(
      2,
      "0"
    )}:${String(selectedDate.getSeconds()).padStart(2, "0")}`;
    return formattedDate;
  };

  const handleChangeEvents = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputEvents((prev) => ({ ...prev, [name]: value }));
    console.log(name);
  };

  const openModal = (date: number) => {
    console.log(formatSelectedDate(date));

    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleCreateEvents = async () => {
    setSuccess("");
    setError("");
    try {
      await dispatch(
        createCalendar({
          id: schools.id,
          date: formatSelectedDate(selectedDate as number),
          description: inputEvents.description,
        })
      ).unwrap();
      setSuccess("Events created");
      setInputEvents({ date: "", description: "" });
      fetchCalendars();
      closeModal();
    } catch (error: any) {
      setError(error.message || "Error creating events");
    }
  };

  return (
    <div className="h-[97vh] 2xl:h-[98.2vh] bg-white rounded-md flex flex-col gap-4 border border-slate-200">
      <div className="border-b-2 border-slate-200 px-5 py-2 flex justify-between items-center">
        <div className="text-sm">
          <ul className="flex gap-3 items-center">
            <li>
              <IoAddOutline size={20} color="#4c637d" />
            </li>
            <div className="w-[2px] rounded-full bg-slate-200 h-4" />
            <li className="flex items-center gap-2">
              <PiCalendarDotsFill size={15} color="#0D9485" />
              <p className="text-sm text-custom-green-2">Calendar</p>
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

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex gap-4 overflow-auto ">
            <div className="px-5 py-4 flex-1">
              <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="py-2 text-custom-green-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 text-center gap-y-2 gap-x-2">
                {calendarDates.map((date, index) => {
                  if (date === null) {
                    return <div key={index} className="py-5 bg-white"></div>;
                  }

                  const isTodayDate =
                    date === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();

                  const hasEvent = calendars.some((cal) => {
                    if (!cal.date) return false;
                    const eventDate = new Date(cal.date);
                    return (
                      eventDate.getDate() === date &&
                      eventDate.getMonth() === currentMonth &&
                      eventDate.getFullYear() === currentYear
                    );
                  });

                  return (
                    <div
                      key={index}
                      className={`py-5 rounded-md ${
                        hasEvent
                          ? "bg-blue-100"
                          : "bg-slate-50 hover:bg-slate-100 cursor-pointer"
                      } ${isTodayDate ? "border border-custom-green-2" : ""}`}
                      onClick={() => !hasEvent && openModal(date)}
                    >
                      <span
                        className={`${
                          isTodayDate
                            ? "text-custom-green-2 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {date}
                      </span>
                      {hasEvent && (
                        <div className="mt-1 w-2 h-2 bg-custom-green-2 rounded-full mx-auto"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-auto px-5 py-4 no-scrollbar">
              <p className="text-sm text-gray-500">
                Descriptions or events for {schools.name || "school's name"}{" "}
                will be displayed here.
              </p>
              <div className="mt-4 ">
                {calendars.length > 0 ? (
                  calendars.map((cal, index) => {
                    const eventDate = new Date(String(cal.date));
                    const formattedDate = format(eventDate, "dd MMMM yyyy");
                    return (
                      <div
                        key={index}
                        className="mb-2 p-2 bg-slate-100 rounded-md"
                      >
                        <p className="font-semibold">{formattedDate}</p>
                        <p className="text-gray-600">{cal.description}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400">No events for this month.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <ModalCrud
        headText=""
        title="Create Events"
        isOpen={isModalOpen}
        inputLabel="Date Events"
        placeholder="input dates"
        inputName="date"
        inputValue={formatSelectedDate(selectedDate as number).split(" ")[0]}
        onChange={handleChangeEvents}
        extraFields={[
          {
            label: "Descriptions",
            placeholder: "Input descriptions",
            name: "description",
            value: inputEvents.description!,
            onChange: handleChangeEvents,
          },
        ]}
        textOk="Create"
        textCancel="Cancel"
        inputType="text"
        functionCancel={closeModal}
        functionOk={handleCreateEvents}
      />

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

import React, { ChangeEvent, useEffect, useState } from "react";
import { Admin, School, Student, Teacher } from "../types/types";
import {
  Button,
  Dropdown,
  Filter,
  Loading,
  SearchBar,
  Sort,
  Table,
} from "../components";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import {
  addTeacher,
  deleteTeacher,
  getTeachersBySchoolId,
  updateTeacher,
} from "../redux/slicer/teacherSlice";
import {
  IoAddOutline,
  IoCalendar,
  IoFemaleOutline,
  IoMaleFemaleOutline,
  IoMaleOutline,
} from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { Pagination } from "../components/Pagination";
import { ModalCrud } from "../components/ModalCrud";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  PiMapPinLight,
  PiUserList,
  PiTextAaLight,
  PiGenderMaleLight,
  PiGenderFemaleLight,
  PiDotsThreeLight,
  PiCalendarDotLight,
  PiMosqueLight,
} from "react-icons/pi";

interface TeachersProps {
  student: Student[];
  teacher: Teacher[];
  user: Admin;
  schools: School;
  handleTeacherSelect: (id: string) => void;
}

export const Teachers: React.FC<TeachersProps> = ({
  user,
  handleTeacherSelect,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] =
    useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterGender, setFilterGender] = useState<string>("");
  const [inputTeacher, setInputTeacher] = useState<Teacher>({
    name: "",
    address: "",
    born: "",
    gender: "",
    religion: "",
    nip: "",
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBornDate, setSelectedBornDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState<boolean>(true);

  const formatDate = (date: Date): string => {
    return format(date, "dd MMMM yyyy", { locale: id });
  };

  useEffect(() => {
    if (user?.schoolId) {
      fetchTeacher();
    }
  }, [user?.schoolId]);

  const fetchTeacher = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        getTeachersBySchoolId({ id: Number(user.schoolId) })
      ).unwrap();
      setTeachers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleChangeTeacher = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputTeacher((prev) => ({ ...prev, [name]: value }));
    console.log(name);

    if (name === "born" && value.trim() === "") {
      setSelectedBornDate(null);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedBornDate(date);
    setIsDatePickerOpen(false);
    if (date) {
      const formattedDate = formatDate(date);
      const baseBorn = inputTeacher.born!.split(",")[0];
      setInputTeacher((prev) => ({
        ...prev,
        born: `${baseBorn}, ${formattedDate}`,
      }));
    }
  };

  const handleModalAdd = () => {
    setIsAdding(!isAdding);
    if (!isAdding) {
      setInputTeacher({
        name: "",
        address: "",
        born: "",
        gender: "",
        religion: "",
        nip: "",
      });
      setSelectedBornDate(null);
    }
  };

  const handleModalEdit = (teacherId?: string) => {
    const teacherToEdit = teachers.find(
      (teacher) => String(teacher.id) === teacherId
    );

    if (teacherToEdit) {
      const bornParts = teacherToEdit.born!.split(", ");
      setInputTeacher({
        name: teacherToEdit.name || "",
        address: teacherToEdit.address || "",
        born: teacherToEdit.born || "",
        gender: teacherToEdit.gender || "",
        religion: teacherToEdit.religion || "",
        nip: teacherToEdit.nip || "",
      });

      if (bornParts.length > 1) {
        const dateString = bornParts[1];
        const parsedDate = parse(dateString, "dd MMMM yyyy", new Date(), {
          locale: id,
        });
        setSelectedBornDate(parsedDate);
      } else {
        setSelectedBornDate(null);
      }

      setStudentId(teacherId!);
    }
    setIsEditing(!isEditing);
  };

  const handleModalDelete = (teacherId?: string) => {
    const teacherToDelete = teachers.find(
      (teacher) => String(teacher.id) === teacherId
    );
    if (teacherToDelete) {
      setInputTeacher({
        name: teacherToDelete.name || "",
        address: teacherToDelete.address || "",
        born: teacherToDelete.born || "",
        gender: teacherToDelete.gender || "",
        religion: teacherToDelete.religion || "",
        nip: teacherToDelete.nip || "",
      });
      setStudentId(teacherId!);
    }
    setIsDeleting(!isDeleting);
  };

  const handleSort = (criteria: "name" | "gender") => {
    const sortedTeachers = [...teachers].sort((a, b) => {
      if (criteria === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (criteria === "gender") {
        return sortOrder === "asc"
          ? (a.gender || "").localeCompare(b.gender || "")
          : (b.gender || "").localeCompare(a.gender || "");
      }
      return 0;
    });
    setTeachers(sortedTeachers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterGender ? teacher.gender === filterGender : true)
  );

  const currentPageTeacher = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGenderDropdownToggle = () => {
    setIsGenderDropdownOpen(!isGenderDropdownOpen);
    setOpenDropdownId(null);
  };

  const handleFilterGenderChange = (gender: string) => {
    setFilterGender(gender);
    setIsGenderDropdownOpen(false);
    setCurrentPage(1);
  };

  const handleDropdownOpen = (id: string) => {
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
  };

  const handleSelectAction = (action: string, id: string) => {
    if (action === "Edit") {
      handleModalEdit(id);
    } else if (action === "Delete") {
      handleModalDelete(id);
    }
    setOpenDropdownId(null);
  };

  const genderOptions = [
    { name: "Male", value: "Male", icon: <IoMaleOutline color="#de5757" /> },
    {
      name: "Female",
      value: "Female",
      icon: <IoFemaleOutline color="#e89241" />,
    },
    { name: "All", value: "", icon: <IoMaleFemaleOutline color="#11acfa" /> },
  ];

  const headers = [
    { head: "Name", icon: <PiTextAaLight size={15} /> },
    { head: "Address", icon: <PiMapPinLight size={15} /> },
    { head: "Birthday", icon: <PiCalendarDotLight size={15} /> },
    {
      head: "Gender",
      icon: (
        <div className="flex ">
          <PiGenderMaleLight size={15} className="-rotate-45" />
          <PiGenderFemaleLight size={15} />
        </div>
      ),
    },
    { head: "Religion", icon: <PiMosqueLight size={15} /> },
    { head: "Details", icon: <PiUserList size={15} /> },
    { head: "", icon: <PiDotsThreeLight size={15} /> },
  ];

  const moreOptions = [
    {
      name: "Edit",
      value: "Edit",
      icon: <MdEdit color="#11acfa" />,
    },
    {
      name: "Delete",
      value: "Delete",
      icon: <MdDelete color="#de5757" />,
    },
  ];

  const handleSaveAddStudent = async () => {
    try {
      await dispatch(
        addTeacher({
          name: inputTeacher.name,
          address: inputTeacher.address,
          born: inputTeacher.born,
          gender: inputTeacher.gender,
          schoolId: String(user?.schoolId),
        })
      ).unwrap();

      await fetchTeacher();
      handleModalAdd();

      setInputTeacher({
        name: "",
        address: "",
        born: "",
        gender: "",
        religion: "",
        nip: "",
      });
      setSelectedBornDate(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveEditStudent = async () => {
    if (!studentId) return;
    try {
      await dispatch(
        updateTeacher({
          id: studentId,
          teacher: {
            name: inputTeacher.name,
            address: inputTeacher.address,
            born: inputTeacher.born,
            gender: inputTeacher.gender,
            religion: inputTeacher.religion,
            nip: inputTeacher.nip,
          },
        })
      ).unwrap();

      await fetchTeacher();
      handleModalEdit();

      setInputTeacher({
        name: "",
        address: "",
        born: "",
        gender: "",
        religion: "",
        nip: "",
      });
      setSelectedBornDate(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveDeleteStudent = async () => {
    if (!studentId) return;

    try {
      await dispatch(
        deleteTeacher({
          id: studentId,
        })
      ).unwrap();

      await fetchTeacher();
      handleModalDelete();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getLastUpdateTime = (data: Teacher[]): string | null => {
    if (!data || data.length === 0) return null;

    const dataWithUpdate = data.filter((student) => student.updatedAt);

    if (dataWithUpdate.length === 0) return null;

    const sortedData = [...dataWithUpdate].sort((a, b) => {
      const dateA = new Date(a.updatedAt!).getTime();
      const dateB = new Date(b.updatedAt!).getTime();
      return dateB - dateA;
    });

    return sortedData[0].updatedAt || null;
  };

  const lastUpdated = getLastUpdateTime(teachers);
  const now = new Date() as any;
  let timeSinceUpdate = "No data available";

  if (lastUpdated) {
    const lastUpdatedDate = new Date(lastUpdated);
    const timeDifference = Math.floor(
      (now.getTime() - lastUpdatedDate.getTime()) / 1000
    );

    if (timeDifference !== null) {
      const days = Math.floor(timeDifference / 86400);
      const hours = Math.floor((timeDifference % 86400) / 3600);
      const minutes = Math.floor((timeDifference % 3600) / 60);
      const seconds = timeDifference % 60;

      if (days > 0) {
        timeSinceUpdate = `${days} day${days > 1 ? "s" : ""}, ${hours} hour${
          hours > 1 ? "s" : ""
        } ago`;
      } else if (hours > 0) {
        timeSinceUpdate = `${hours} hour${
          hours > 1 ? "s" : ""
        }, ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        timeSinceUpdate = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        timeSinceUpdate = `${seconds} second${seconds > 1 ? "s" : ""} ago`;
      }
    }
  }

  return (
    <div className="overflow-auto h-full bg-white rounded-md flex flex-col gap-4 border border-slate-200">
      <div className="border-b-2 border-slate-200 px-5 py-2 flex justify-between items-center">
        <div className="text-sm">
          <ul className="flex gap-3 items-center">
            <li>
              <IoAddOutline size={20} color="#4c637d" />
            </li>
            <div className="w-[2px] rounded-full bg-slate-200 h-4" />
            <li className="flex items-center gap-2">
              <FaUserTie size={15} color="#0D9485" />
              <p className="text-sm text-custom-green-2">Teachers</p>
            </li>
          </ul>
        </div>
        <Pagination
          totalItems={filteredTeachers.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="border-b-2 border-slate-200 pb-5 px-5">
            <div className="mb-3">
              <h1 className="font-bold text-2xl">Manage Teachers</h1>
              <p className="text-slate-500 text-xs">Manage your teachers</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-1 items-center">
                <Button
                  style="border rounded-lg border-slate-300 flex flex-row gap-1 items-center px-2 bg-white py-[7px]"
                  handle={handleModalAdd}
                >
                  <IoAddOutline size={15} color="#0d9485" />
                  <p className="text-xs">Add Teacher</p>
                </Button>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearchChange}
                  setSearch={setSearchQuery}
                />
                <div className="w-[2px] rounded-full bg-slate-200 h-4" />
                <div className="relative">
                  <Filter handle={handleGenderDropdownToggle} />
                  {isGenderDropdownOpen && (
                    <Dropdown
                      options={genderOptions}
                      onSelect={handleFilterGenderChange}
                    />
                  )}
                </div>
                <Sort handle={() => handleSort("name")} />
              </div>
            </div>
          </div>
          <div className="px-3">
            <p className="text-xs flex justify-end gap-2 mb-3">
              <span>last updates,</span>
              <span className="text-custom-green-2"> {timeSinceUpdate}</span>
            </p>

            <Table
              header={headers}
              body={currentPageTeacher}
              options={moreOptions}
              selected={handleSelectAction}
              selectedId={openDropdownId}
              handleDropdownOpen={handleDropdownOpen}
              isDropdownOpen={openDropdownId !== null}
              handleStudentSelect={handleTeacherSelect}
            />
          </div>
        </>
      )}

      <ModalCrud
        headText=""
        title="Add Teacher"
        isOpen={isAdding}
        inputLabel="Name"
        placeholder="Input name"
        inputName="name"
        inputValue={inputTeacher.name}
        onChange={handleChangeTeacher}
        extraFields={[
          {
            label: "Address",
            placeholder: "Input address",
            name: "address",
            value: inputTeacher.address!,
            onChange: handleChangeTeacher,
          },
          {
            label: "Born",
            placeholder: "Input born",
            name: "born",
            value: inputTeacher.born!,
            onChange: handleChangeTeacher,
          },
          {
            label: "Gender",
            placeholder: "Select gender",
            name: "gender",
            value: inputTeacher.gender!,
            onChange: handleChangeTeacher,
          },
        ]}
        textOk="Add"
        textCancel="Cancel"
        inputType="text"
        functionCancel={handleModalAdd}
        functionOk={handleSaveAddStudent}
      >
        {inputTeacher.born!.trim() !== "" && (
          <>
            <div className="flex items-center gap-2 mt-2 absolute flex-col z-50 top-[18px] right-[2px]">
              <Button
                style="flex items-center px-2 h-7"
                handle={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                <IoCalendar size={15} color="#0D9485" />
              </Button>
            </div>
            <div className="absolute top-[-20vh] left-[7vw] 2xl:top-[-13vh] 2xl:left-[11vw] flex z-50">
              {isDatePickerOpen && (
                <DatePicker
                  selected={selectedBornDate}
                  onChange={handleDateChange}
                  inline
                  locale="id"
                  dateFormat="dd MMMM yyyy"
                />
              )}
            </div>
          </>
        )}
      </ModalCrud>

      <ModalCrud
        inputType="text"
        headText=""
        title="Edit Teacher"
        isOpen={isEditing}
        functionCancel={handleModalEdit}
        functionOk={handleSaveEditStudent}
        textCancel="Cancel"
        textOk="Save"
        inputValue={inputTeacher.name}
        onChange={handleChangeTeacher}
        inputName="name"
        placeholder="Enter name"
        inputLabel="Name"
        extraFields={[
          {
            label: "Born",
            placeholder: "Input born",
            name: "born",
            value: inputTeacher.born!,
            onChange: handleChangeTeacher,
          },
        ]}
      >
        {inputTeacher.born!.trim() !== "" && (
          <>
            <div className="flex items-center gap-2 mt-2 absolute flex-col z-50 top-[18px] right-[2px]">
              <Button
                style="flex items-center px-2 h-7"
                handle={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                <IoCalendar size={15} color="#0D9485" />
              </Button>
            </div>
            <div className="absolute top-[-10vh] flex z-50">
              {isDatePickerOpen && (
                <DatePicker
                  selected={selectedBornDate}
                  onChange={handleDateChange}
                  inline
                  locale="id"
                  dateFormat="dd MMMM yyyy"
                />
              )}
            </div>
          </>
        )}
      </ModalCrud>

      <ModalCrud
        headText=""
        title="Delete Teacher"
        isOpen={isDeleting}
        inputLabel="Name"
        isDisabled={true}
        inputName="name"
        inputValue={inputTeacher.name}
        textOk="Delete"
        textCancel="Cancel"
        inputType="text"
        functionCancel={handleModalDelete}
        functionOk={handleSaveDeleteStudent}
      />
    </div>
  );
};

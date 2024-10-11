import React, { ChangeEvent, useEffect, useState } from "react";
import { Admin, School, Student, Teacher } from "../types/types";
import { Table } from "../components/Table";
import {
  Button,
  Dropdown,
  Filter,
  Loading,
  SearchBar,
  Sort,
} from "../components";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import {
  addStudent,
  deleteStudent,
  getStudentsBySchoolId,
  updateStudent,
} from "../redux/slicer/studentSlice";
import {
  IoMaleOutline,
  IoFemaleOutline,
  IoMaleFemaleOutline,
  IoAddOutline,
} from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  PiChalkboardTeacherLight,
  PiDotsThreeLight,
  PiGenderFemaleLight,
  PiGenderMaleLight,
  PiMapPinLight,
  PiScanSmileyLight,
  PiTextAaLight,
  PiUserList,
} from "react-icons/pi";
import { ModalCrud } from "../components/ModalCrud";
import { Pagination } from "../components/Pagination";

interface StudentProps {
  student: Student[];
  teacher: Teacher[];
  user: Admin;
  schools: School;
  handleStudentSelect: (id: string) => void;
}

export const Students: React.FC<StudentProps> = ({
  user,
  handleStudentSelect,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const itemsPerPage = 6;
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] =
    useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterGender, setFilterGender] = useState<string>("");
  const [inputStudent, setInputStudent] = useState<Student>({
    name: "",
    classroom: "",
    parentName: "",
    job: "",
    relationship: "",
    parentPhone: "",
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.schoolId) {
      fetchStudent();
    }
  }, [user?.schoolId]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        getStudentsBySchoolId({ id: Number(user.schoolId) })
      ).unwrap();
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangeStudent = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalAdd = () => {
    setIsAdding(!isAdding);
  };

  const handleModalEdit = (id?: string) => {
    const studentToEdit = students.find((student) => String(student.id) === id);

    if (studentToEdit) {
      setInputStudent({
        name: studentToEdit.name || "",
        classroom: studentToEdit.classroom || "",
        parentName: studentToEdit.parentName || "",
        job: studentToEdit.job || "",
        relationship: studentToEdit.relationship || "",
        parentPhone: studentToEdit.parentPhone || "",
      });
      setStudentId(id!);
    }
    setIsEditing(!isEditing);
  };

  const handleModalDelete = (id?: string) => {
    const studentToDelete = students.find(
      (student) => String(student.id) === id
    );
    if (studentToDelete) {
      setInputStudent({
        name: studentToDelete.name || "",
        classroom: studentToDelete.classroom || "",
        parentName: studentToDelete.parentName || "",
        job: studentToDelete.job || "",
        relationship: studentToDelete.relationship || "",
        parentPhone: studentToDelete.parentPhone || "",
      });
      setStudentId(id!);
    }
    setIsDeleting(!isDeleting);
  };

  const handleSort = (criteria: "name" | "gender") => {
    const sortedStudents = [...students].sort((a, b) => {
      if (criteria === "name") {
        return sortOrder === "asc"
          ? a.name!.localeCompare(b.name!)
          : b.name!.localeCompare(a.name!);
      } else if (criteria === "gender") {
        return sortOrder === "asc"
          ? (a.gender || "").localeCompare(b.gender || "")
          : (b.gender || "").localeCompare(a.gender || "");
      }
      return 0;
    });
    setStudents(sortedStudents);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name!.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterGender ? student.gender === filterGender : true)
  );

  const currentPageStudent = filteredStudents.slice(
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
    { head: "Class", icon: <PiChalkboardTeacherLight size={15} /> },
    {
      head: "Gender",
      icon: (
        <div className="flex ">
          <PiGenderMaleLight size={15} className="-rotate-45" />
          <PiGenderFemaleLight size={15} />
        </div>
      ),
    },
    { head: "Status", icon: <PiScanSmileyLight size={15} /> },
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
        addStudent({
          name: inputStudent.name!,
          classroom: inputStudent.classroom!,
          schoolId: String(user?.schoolId),
        })
      ).unwrap();

      await fetchStudent();
      handleModalAdd();

      setInputStudent({
        name: "",
        classroom: "",
        parentName: "",
        job: "",
        relationship: "",
        parentPhone: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveEditStudent = async () => {
    if (!studentId) return;
    try {
      await dispatch(
        updateStudent({
          id: studentId,
          student: {
            name: inputStudent.name,
            classroom: inputStudent.classroom,
            parentName: inputStudent.parentName,
            job: inputStudent.job,
            relationship: inputStudent.relationship,
            parentPhone: inputStudent.parentPhone,
          },
        })
      ).unwrap();

      await fetchStudent();
      handleModalEdit();

      setInputStudent({
        name: "",
        classroom: "",
        parentName: "",
        job: "",
        relationship: "",
        parentPhone: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveDeleteStudent = async () => {
    if (!studentId) return;

    try {
      await dispatch(
        deleteStudent({
          id: studentId,
        })
      ).unwrap();

      await fetchStudent();
      handleModalDelete();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getLastUpdateTime = (data: Student[]): string | null => {
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

  const lastUpdated = getLastUpdateTime(students);
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
            <li className="">
              <IoAddOutline size={20} color="#4c637d" />
            </li>
            <div className="w-[2px] rounded-full bg-slate-200 h-4" />
            <li className="flex items-center gap-2">
              <FaUserGraduate size={15} color="#0D9485" />
              <p className="text-sm text-custom-green-2">Students</p>
            </li>
          </ul>
        </div>
        <Pagination
          totalItems={filteredStudents.length}
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
              <h1 className="font-bold text-2xl">Manage Student</h1>
              <p className="text-slate-500 text-xs">Manage your students</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-1 items-center">
                <Button
                  style="border rounded-lg border-slate-300 flex flex-row gap-1 items-center px-2 bg-white py-[7px]"
                  handle={handleModalAdd}
                >
                  <IoAddOutline size={15} color="#0d9485" />
                  <p className="text-xs">Add Student</p>
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
              body={currentPageStudent}
              options={moreOptions}
              selected={handleSelectAction}
              selectedId={openDropdownId}
              handleDropdownOpen={handleDropdownOpen}
              isDropdownOpen={openDropdownId !== null}
              handleStudentSelect={handleStudentSelect}
            />
          </div>
        </>
      )}

      <ModalCrud
        headText=""
        title="Add Student"
        isOpen={isAdding}
        inputLabel="Student Name"
        placeholder="Input student name"
        inputName="name"
        inputValue={inputStudent.name!}
        onChange={(text) => handleChangeStudent(text)}
        extraFields={[
          {
            label: "Class",
            placeholder: "Input class",
            name: "classroom",
            value: inputStudent.classroom!,
            onChange: (text) => handleChangeStudent(text),
          },
        ]}
        textOk="Add"
        textCancel="Cancel"
        inputType="text"
        functionCancel={handleModalAdd}
        functionOk={handleSaveAddStudent}
      />

      <ModalCrud
        inputType="text"
        headText=""
        title="Edit Student"
        isOpen={isEditing}
        functionCancel={handleModalEdit}
        functionOk={handleSaveEditStudent}
        textCancel="Cancel"
        textOk="Save"
        inputValue={inputStudent.name!}
        onChange={(text) => handleChangeStudent(text)}
        inputName="name"
        placeholder="Enter student name"
        inputLabel="Student Name"
        extraFields={[
          {
            label: "Class",
            placeholder: "Enter class",
            name: "classroom",
            value: inputStudent.classroom!,
            onChange: (text) => handleChangeStudent(text),
          },
        ]}
      />

      <ModalCrud
        headText=""
        title="Delete Student"
        isOpen={isDeleting}
        inputLabel="Name"
        isDisabled={true}
        inputName="name"
        inputValue={inputStudent.name!}
        textOk="Delete"
        textCancel="Cancel"
        inputType="text"
        functionCancel={handleModalDelete}
        functionOk={handleSaveDeleteStudent}
      />
    </div>
  );
};

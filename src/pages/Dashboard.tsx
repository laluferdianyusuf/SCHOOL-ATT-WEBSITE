import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { ReactNode, useEffect, useState } from "react";
import Sidebar from "../Navigation/Sidebar";
import {
  AboutUs,
  AttendancesDetails,
  Calendars,
  ChangePassword,
  EditStudentDetails,
  EditTeacherDetails,
  Home,
  NewsScreen,
  Profile,
  StudentDetails,
  Students,
  TeacherDetails,
  Teachers,
} from "../contents";
import { currentUser, logout } from "../redux/slicer/adminSlice";
import { Admin, School, Student, Teacher } from "../types/types";
import { getStudentsBySchoolId } from "../redux/slicer/studentSlice";
import { getTeachersBySchoolId } from "../redux/slicer/teacherSlice";
import { listSchoolById } from "../redux/slicer/schoolSlice";
import { useNavigate } from "react-router-dom";
import { ModalConfirmation, NotificationAlert } from "../components";
import { PiWarningFill } from "react-icons/pi";

export default function Dashboard() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [admins, setAdmins] = useState<Admin>();
  const [schools, setSchools] = useState<School>();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedStudentData, setSelectedStudentData] =
    useState<Student | null>(null);
  const [selectedTeacherData, setSelectedTeacherData] =
    useState<Teacher | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  useEffect(() => {
    if (admins?.schoolId) {
      fetchSchools();
    }
  }, [admins?.schoolId]);

  useEffect(() => {
    if (schools?.id) {
      fetchStudent();
      fetchTeacher();
    }
  }, [schools?.id]);

  const fetchAdmin = async () => {
    await dispatch(currentUser())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setIsLoggedIn(true);
          setAdmins(response.data);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoggedIn(false);
      });
  };

  const fetchStudent = async () => {
    try {
      const res = await dispatch(
        getStudentsBySchoolId({ id: Number(schools?.id) })
      ).unwrap();
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTeacher = async () => {
    try {
      const res = await dispatch(
        getTeachersBySchoolId({ id: Number(schools?.id) })
      ).unwrap();
      setTeachers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await dispatch(
        listSchoolById({ id: Number(admins?.schoolId)! })
      ).unwrap();
      setSchools(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDashboardClick = () => {
    setActiveMenu("Home");
  };

  const handleNewsClick = () => {
    setActiveMenu("News");
  };

  const handleStudentSelect = (id: string) => {
    setSelectedStudent(id);
    setActiveMenu("StudentsDetail");
  };

  const handleTeacherSelect = (id: string) => {
    setSelectedTeacher(id);
    setActiveMenu("TeachersDetail");
  };

  const handleBackStudent = () => {
    setSelectedStudent("");
    setActiveMenu("Students");
  };

  const handleBackTeacher = () => {
    setSelectedTeacher("");
    setActiveMenu("Teachers");
  };

  const handleBackStudentDetails = () => {
    setActiveMenu("StudentsDetail");
  };
  const handleBackTeacherDetails = () => {
    setActiveMenu("TeachersDetail");
  };

  const handleStudentSelectAtt = (data: Student) => {
    setSelectedStudentData(data);
    setActiveMenu("AttendanceDetail");
  };

  const handleStudentSelectToEdit = (data: Student) => {
    setSelectedStudentData(data);
    setActiveMenu("EditStudentsDetail");
  };

  const handleTeacherSelectToEdit = (data: Teacher) => {
    setSelectedTeacherData(data);
    setActiveMenu("EditTeachersDetail");
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(!isLogoutModalOpen);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logout()).unwrap();
      setIsLoggedIn(false);
      setIsLogoutModalOpen(false);
      navigate("/");
    } catch (error) {
      setError("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Home":
        return (
          <Home
            student={students}
            teacher={teachers}
            user={admins!}
            schools={schools!}
            handleDashboardClick={handleDashboardClick}
            handleNewsClick={handleNewsClick}
            setActiveMenu={setActiveMenu}
            isCollapsed={isCollapsed}
          />
        );
      case "Teachers":
        return (
          <Teachers
            student={students}
            teacher={teachers}
            user={admins!}
            schools={schools!}
            handleTeacherSelect={handleTeacherSelect}
          />
        );
      case "Students":
        return (
          <Students
            student={students}
            teacher={teachers}
            user={admins!}
            schools={schools!}
            handleStudentSelect={handleStudentSelect}
          />
        );
      case "Calendar":
        return (
          <Calendars
            student={students}
            teacher={teachers}
            user={admins!}
            schools={schools!}
          />
        );
      case "About Us":
        return <AboutUs />;

      case "StudentsDetail":
        return (
          <StudentDetails
            selectedStudent={selectedStudent}
            onBack={handleBackStudent}
            handleStudentSelect={handleStudentSelectAtt}
            handleStudentSelectToEdit={handleStudentSelectToEdit}
          />
        );
      case "TeachersDetail":
        return (
          <TeacherDetails
            selectedTeacher={selectedTeacher}
            onBack={handleBackTeacher}
            handleTeacherSelectToEdit={handleTeacherSelectToEdit}
          />
        );
      case "AttendanceDetail":
        return (
          <AttendancesDetails
            selectedStudent={selectedStudentData}
            onBackToStudent={handleBackStudent}
            onBack={handleBackStudentDetails}
          />
        );
      case "EditStudentsDetail":
        return (
          <EditStudentDetails
            selectedStudent={selectedStudentData}
            onBackToStudent={handleBackStudent}
            onBack={handleBackStudentDetails}
          />
        );
      case "EditTeachersDetail":
        return (
          <EditTeacherDetails
            selectedTeacher={selectedTeacherData}
            onBackToTeacher={handleBackTeacher}
            onBack={handleBackTeacherDetails}
          />
        );
      case "News":
        return (
          <NewsScreen
            student={students}
            teacher={teachers}
            user={admins!}
            schools={schools!}
            handleDashboardClick={handleDashboardClick}
            setActiveMenu={setActiveMenu}
          />
        );
      case "Profile":
        return (
          <Profile
            student={students}
            teacher={teachers}
            user={admins!}
            schools={schools!}
            handleDashboardClick={handleDashboardClick}
            setActiveMenu={setActiveMenu}
          />
        );
      case "Change Password":
        return (
          <ChangePassword
            student={students}
            teacher={teachers}
            user={admins!}
            schools={schools!}
            handleDashboardClick={handleDashboardClick}
            setActiveMenu={setActiveMenu}
          />
        );

      default:
        return (
          <Home
            student={students}
            teacher={teachers}
            user={admins!}
            schools={schools!}
            handleDashboardClick={handleDashboardClick}
            handleNewsClick={handleNewsClick}
            setActiveMenu={setActiveMenu}
          />
        );
    }
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
  };

  return (
    <div className="w-full min-h-screen bg-custom-white-1 flex flex-row">
      <Sidebar
        activeMenu={activeMenu}
        handleMenuClick={handleMenuClick}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        user={admins!}
        schools={schools!}
        toggleCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
      />
      <div className="flex-grow my-2 ml-5 mr-2">
        {renderContent() as ReactNode}
      </div>
      <ModalConfirmation
        title="Logout Confirmation"
        textCancel="Cancel"
        textOk={isLoggingOut ? "Logging out..." : "Logout"}
        functionCancel={handleLogout}
        functionOk={confirmLogout}
        isOpen={isLogoutModalOpen}
        isLoading={isLoggingOut}
      />

      {error && (
        <NotificationAlert
          icon={<PiWarningFill size={15} color="#de5757" />}
          text={error}
        />
      )}
    </div>
  );
}

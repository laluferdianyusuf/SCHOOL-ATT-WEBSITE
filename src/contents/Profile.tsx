import React, {
  Dispatch,
  SetStateAction,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { Admin, School, Student, Teacher } from "../types/types";
import { IoAddOutline, IoCalendar } from "react-icons/io5";
import {
  PiCheckCircleFill,
  PiGooglePodcastsLogo,
  PiUserCircleFill,
  PiUserCirclePlusLight,
  PiWarningFill,
} from "react-icons/pi";
import { InputField, NotificationAlert } from "../components";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { adminRegister } from "../redux/slicer/adminSlice";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import DatePicker from "react-datepicker";

interface ProfileProps {
  student: Student[];
  teacher: Teacher[];
  user: Admin;
  schools: School;
  handleDashboardClick: () => void;
  setActiveMenu: Dispatch<SetStateAction<string>>;
}

export const Profile: React.FC<ProfileProps> = ({ user, schools }) => {
  const dispatch: AppDispatch = useDispatch();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Admin>({
    name: "",
    username: "",
    email: "",
    password: "",
    birthday: "",
    address: "",
    phoneNumber: "",
  });
  const [selectedBornDate, setSelectedBornDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const formatDate = (date: Date): string => {
    return format(date, "dd MMMM yyyy", { locale: id });
  };

  const handleForm = () => {
    setShowForm(!showForm);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "birthday" && value.trim() === "") {
      setSelectedBornDate(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        schoolId: schools.id,
      };
      await dispatch(adminRegister(payload)).unwrap();
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        birthday: "",
        address: "",
        phoneNumber: "",
      });
      setShowForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
    });
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedBornDate(date);
    setIsDatePickerOpen(false);
    if (date) {
      const formattedDate = formatDate(date);
      const baseBorn = formData.birthday!.split(",")[0];
      setFormData((prev) => ({
        ...prev,
        birthday: `${baseBorn}, ${formattedDate}`,
      }));
    }
  };

  return (
    <div className="overflow-auto h-[97vh] 2xl:h-[98.2vh] bg-white rounded-md flex flex-col border border-slate-200">
      <div className="border-b-2 border-slate-200 px-5 py-3 flex justify-between items-center">
        <div className="text-sm">
          <ul className="flex gap-3 items-center">
            <li>
              <IoAddOutline size={20} color="#4c637d" />
            </li>
            <div className="w-[2px] rounded-full bg-slate-200 h-4" />
            <li className="flex items-center gap-2">
              <PiUserCircleFill size={20} color="#0D9485" />
              <p className="text-sm text-custom-green-2">{user.name}</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="items-center">
        <div className="w-full border-b-2 border-slate-200 pb-4">
          <div className="px-10 flex gap-5">
            <div className="w-36 h-36 bg-custom-green-light border-2 border-white shadow-md items-center flex justify-center text-5xl rounded-full mt-5">
              <PiGooglePodcastsLogo size={55} className="rotate-45" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <div>
                <p className="text-xl font-bold capitalize">{user.username}</p>
                <p>{user.email}</p>
              </div>
              <button
                onClick={handleForm}
                className="flex items-center gap-2 px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
              >
                <PiUserCirclePlusLight size={20} />
                <p className="text-sm">
                  {showForm ? "close" : "Add New Admin"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-auto pb-4">
        <div className="flex-1">
          <div className="pl-10 mt-5">
            <h3 className="text-lg font-bold text-gray-700">User Details</h3>
            <div className="grid grid-cols-2 gap-5 mt-3">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="text-base text-gray-900 font-medium">
                  {user.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="text-base text-gray-900 font-medium">
                  {user.username}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-base text-gray-900 font-medium">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-base text-gray-900 font-medium">
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          <div className="pl-10 mt-5">
            <h3 className="text-lg font-bold text-gray-700">
              Associated Schools
            </h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center justify-between rounded-md">
                <div>
                  <p className="text-base text-gray-900 font-medium">
                    {schools.name}
                  </p>
                  <p className="text-sm text-gray-600">{schools.address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {showForm && (
          <div className="flex-1 pr-10 mt-5 overflow-auto no-scrollbar">
            <h3 className="text-lg font-bold text-gray-700">
              Register New Admin
            </h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="flex gap-3">
                <InputField
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  labelStyle="text-xs"
                  placeholder="name"
                />
                <InputField
                  label="Username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  labelStyle="text-xs"
                  placeholder="username"
                />
              </div>
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                labelStyle="text-xs"
                placeholder="email address"
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                labelStyle="text-xs"
                placeholder="password"
              />
              <div className="flex gap-3">
                <InputField
                  label="Address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  labelStyle="text-xs"
                  placeholder="address"
                />
                <div className="relative w-full">
                  <InputField
                    label="Borndate"
                    name="birthday"
                    type="text"
                    value={formData.birthday}
                    onChange={handleChange}
                    labelStyle="text-xs"
                    placeholder="born date"
                  />
                  {formData.birthday && formData.birthday!.trim() !== "" && (
                    <>
                      <div className="flex items-center gap-2 mt-2 absolute flex-col z-50 top-[18px] right-[2px]">
                        <button
                          type="button"
                          className="flex items-center px-2 h-7"
                          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        >
                          <IoCalendar size={15} color="#0D9485" />
                        </button>
                      </div>
                      <div className="absolute top-[-32vh] left-[-11vw] 2xl:top-[-20vh] 2xl:left-[-6vw] flex z-50">
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
                </div>
                <InputField
                  label="Phone"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  labelStyle="text-xs"
                  placeholder="phone number"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 flex-1 py-2 bg-custom-green-1 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 flex-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
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

import Select from "react-select";
import { adminRegister } from "../redux/slicer/adminSlice";
import { addSchool, listSchool } from "../redux/slicer/schoolSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { School } from "../types/types";
import {
  AddSchoolModal,
  Button,
  InputField,
  NotificationAlert,
} from "../components";
import { PiCheckCircleFill, PiWarningFill } from "react-icons/pi";

interface RegisterProps {
  onLogin: () => void;
}

interface SetSchoolProps {
  label: string;
  value: string | number;
}
export const Register = ({ onLogin }: RegisterProps) => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [school, setSchool] = useState<SetSchoolProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  useEffect(() => {
    fetchSchool();
  }, []);

  const fetchSchool = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(listSchool()).unwrap();
      setSchools(res.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    else if (name === "username") setUsername(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSchoolChange = (selectedOption: any) => {
    if (selectedOption.value === "add-school") {
      setIsModalOpen(true);
      setSchool(null);
    } else {
      setSchool(selectedOption);
    }
  };

  const options: SetSchoolProps[] = [
    ...(Array.isArray(schools)
      ? schools.map((school) => ({
          label: school.name,
          value: school.id !== undefined ? school.id : "",
        }))
      : []),
    { label: "Add School", value: "add-school" },
  ];

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(false);
    setSuccess("");
    setError("");
    try {
      if (school && school.value !== "add-school") {
        dispatch(
          adminRegister({
            name,
            username,
            email,
            password,
            schoolId: school.value,
          })
        ).unwrap();
        setSuccess(`Your account has been registered`);

        onLogin();
      } else {
        setLoading(false);
        setError("Please select school name");
      }
    } catch (error: any) {
      setError(error.message || "Register error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchool = (schoolData: School) => {
    dispatch(addSchool(schoolData))
      .unwrap()
      .then((newSchool) => {
        setSchool({ label: newSchool.name, value: newSchool.id });
        setIsModalOpen(false);
        dispatch(listSchool());
      })
      .catch((error: any) => {
        console.error("Failed to add school:", error);
        setIsModalOpen(false);
      });
  };

  const customStyles: any = {
    control: (provided: any, state: any) => ({
      ...provided,
      margin: "0px",
      padding: "0px",
      border: state.isFocused ? "1px solid #14b8a6" : "1px solid #cbd5e1",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : undefined,
      "&:hover": {
        borderColor: "#14b8a6",
      },
      fontSize: "12px",
      color: "#0f172a",
      fontWeight: "500",
      minHeight: "35px",
      height: "35px",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      maxHeight: "200px",
      overflowY: "auto",
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: "0px",
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#48bb78" : provided.backgroundColor,
      color: state.isSelected ? "#fff" : "#48bb78",
      fontSize: "12px",
      lineHeight: "1rem",
      padding: "8px",
    }),
  };

  return (
    <>
      <form className="flex flex-col gap-3 px-3" onSubmit={handleFormSubmit}>
        <InputField
          label="Name"
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={handleChange}
          name="name"
          labelStyle="text-xs"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Username"
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={handleChange}
            name="username"
            labelStyle="text-xs"
          />
          <InputField
            label="Email"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={handleChange}
            name="email"
            labelStyle="text-xs"
          />
        </div>
        <InputField
          label="Password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={handleChange}
          name="password"
          labelStyle="text-xs"
        />
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            School
          </label>
          <Select
            placeholder="Select School"
            value={school}
            onChange={handleSchoolChange}
            options={options}
            isLoading={isLoading}
            styles={customStyles}
          />
          <p className="mt-4 text-xs font-medium text-slate-600">
            Already have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={onLogin}
            >
              Login here
            </span>
          </p>
        </div>
        <div className="sm:col-span-2">
          <Button
            handle={handleFormSubmit}
            disabled={loading}
            style="p-2 rounded-xl bg-custom-green-1 text-white w-full"
          >
            <p>{loading ? "Loading..." : "Sign Up"}</p>
          </Button>
        </div>
      </form>
      <AddSchoolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSchool={handleAddSchool}
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
    </>
  );
};

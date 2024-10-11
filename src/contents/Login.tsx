import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { listSchool } from "../redux/slicer/schoolSlice";
import { adminLogin } from "../redux/slicer/adminSlice";
import { School } from "../types/types";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Button, InputField, NotificationAlert } from "../components";
import {
  isMobile,
  isTablet,
  isDesktop,
  browserName,
  osName,
  osVersion,
  mobileModel,
} from "react-device-detect";
import { PiCheckCircleFill, PiWarningFill } from "react-icons/pi";

interface LoginProps {
  onRegister: () => void;
}

export const Login = ({ onRegister }: LoginProps) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [school, setSchool] = useState(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getHardwareType = () => {
    if (isMobile) return "Mobile";
    if (isTablet) return "Tablet";
    if (isDesktop) return "Desktop";
    return "Unknown";
  };

  const getDeviceModel = () => {
    return mobileModel || "Unknown";
  };

  const deviceInfo = {
    deviceType: getHardwareType(),
    deviceModel: getDeviceModel(),
    browser: browserName || "Unknown",
    os: osName || "Unknown",
    osVersion: osVersion || "Unknown",
    cpuCores: navigator.hardwareConcurrency || "Unknown",
  };

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
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleSchoolChange = (selectedOption: any) => {
    setSchool(selectedOption);
  };

  const option =
    (Array.isArray(schools) &&
      schools.map((school) => ({
        label: school.name,
        value: school.id,
      }))) ||
    [];

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      setLoading(true);
      if (school) {
        await dispatch(
          adminLogin({
            username: username,
            password: password,
            schoolId: school,
            device: deviceInfo.os,
            hardware: deviceInfo.deviceType,
          })
        ).unwrap();
        localStorage.setItem("isLoggedIn", "true");
        setSuccess(`Logged in with ${username}`);

        navigate("/dashboard");
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error.message || "login error");
    } finally {
      setLoading(false);
    }
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
      <form
        className="flex flex-col gap-4 overflow-auto no-scrollbar px-3"
        onSubmit={handleFormSubmit}
      >
        <InputField
          label="Username"
          type="text"
          placeholder="Input Username"
          value={username}
          onChange={handleChange}
          name="username"
          labelStyle="text-xs"
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Input Password"
          value={password}
          onChange={handleChange}
          name="password"
          labelStyle="text-xs"
        />
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            School
          </label>
          <Select
            placeholder="Select School"
            value={school}
            onChange={handleSchoolChange}
            options={option}
            isLoading={isLoading}
            styles={customStyles}
          />
        </div>
        <Button
          handle={handleFormSubmit}
          style="p-2 rounded-xl bg-custom-green-1 text-white"
          disabled={loading}
        >
          <p>{loading ? "Loading..." : "Sign In"}</p>
        </Button>
      </form>
      <div className="flex mt-5 justify-center items-center gap-3">
        <div className="w-1/4 h-[2px] bg-slate-100" />
        <p>or</p>
        <div className="w-1/4 h-[2px] bg-slate-100" />
      </div>
      <p className="mt-4 text-xs font-medium text-slate-600 text-center">
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={onRegister}
        >
          Register here
        </span>
      </p>
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

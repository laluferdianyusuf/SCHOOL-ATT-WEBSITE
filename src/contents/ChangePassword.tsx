import React, { Dispatch, SetStateAction, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { PiPasswordFill } from "react-icons/pi";
import { Admin, School, Student, Teacher } from "../types/types";
import { InputField, NotificationAlert } from "../components";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { changePassword } from "../redux/slicer/adminSlice";
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

interface ChangePasswordProps {
  student: Student[];
  teacher: Teacher[];
  user: Admin;
  schools: School;
  handleDashboardClick: () => void;
  setActiveMenu: Dispatch<SetStateAction<string>>;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ user }) => {
  const dispatch: AppDispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await dispatch(
        changePassword({
          id: Number(user.id),
          currentPassword: currentPassword,
          password: newPassword,
          reTypePassword: confirmPassword,
          device: deviceInfo.os,
          hardware: deviceInfo.deviceType,
        })
      ).unwrap();
      setSuccess("change password successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError("Failed to change password");
    }
  };

  return (
    <div className="overflow-auto h-full bg-white rounded-md flex flex-col gap-4 border border-slate-200">
      <div className="border-b-2 border-slate-200 px-5 py-2 flex justify-between items-center">
        <div className="text-sm">
          <ul className="flex gap-3 items-center">
            <li>
              <IoAddOutline size={20} color="#4c637d" />
            </li>
            <div className="w-[2px] rounded-full bg-slate-200 h-4" />
            <li className="flex items-center gap-2 py-[3.5px]">
              <PiPasswordFill size={20} color="#0D9485" />
              <p className="text-sm text-custom-green-2">Change Password</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <InputField
              label="Current Password"
              name="current_password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
            />
          </div>

          <div className="flex flex-col">
            <InputField
              placeholder="New Password"
              label="New Password"
              name="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <InputField
              placeholder="Confirm Password"
              label="Confirm New Password"
              name="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-custom-green-2 text-white py-2 px-4 rounded-md"
          >
            Change Password
          </button>
        </form>
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

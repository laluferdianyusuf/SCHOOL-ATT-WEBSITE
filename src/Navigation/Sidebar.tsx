import { Admin, School } from "../types/types";
import { LuSchool } from "react-icons/lu";
import { HiChevronDoubleLeft } from "react-icons/hi2";
import {
  PiCalendarDotsLight,
  PiCaretRightLight,
  PiGearLight,
  PiGlobeHemisphereWestLight,
  PiGraduationCapLight,
  PiLockLight,
  PiLockOpenLight,
  PiLockSimpleOpenLight,
  PiQuestionMarkLight,
  PiUserCircleLight,
  PiUsersThreeLight,
} from "react-icons/pi";
import { useState } from "react";

interface SidebarProps {
  activeMenu: string;
  handleMenuClick: (menuName: string) => void;
  isLoggedIn?: boolean;
  user: Admin;
  schools: School;
  onLogout?: () => void;
  toggleCollapse?: () => void;
  isCollapsed?: boolean;
}

export default function Sidebar({
  activeMenu,
  handleMenuClick,
  isLoggedIn,
  onLogout,
  schools,
  user,
  toggleCollapse,
  isCollapsed,
}: SidebarProps) {
  const [showAccordion, setShowAccordion] = useState<boolean>(false);

  const handleAccordion = () => {
    setShowAccordion(!showAccordion);
  };

  const mainMenu = [
    {
      name: "Home",
      icon: (
        <PiGlobeHemisphereWestLight
          size={20}
          className={`${
            (isCollapsed && activeMenu === "Home") || activeMenu === "News"
              ? "text-custom-green-2"
              : ""
          }`}
        />
      ),
      handler: () => handleMenuClick("Home"),
    },
  ];

  const managementMenu = [
    {
      name: "Students",
      icon: (
        <PiGraduationCapLight
          size={20}
          className={`${
            (isCollapsed && activeMenu === "Students") ||
            activeMenu === `StudentsDetail` ||
            activeMenu == "AttendanceDetail" ||
            activeMenu == "EditStudentsDetail"
              ? "text-custom-green-2"
              : ""
          }`}
        />
      ),
      handler: () => handleMenuClick("Students"),
    },
    {
      name: "Teachers",
      icon: (
        <PiUsersThreeLight
          size={20}
          className={`${
            (isCollapsed && activeMenu === "Teachers") ||
            activeMenu === `TeachersDetail` ||
            activeMenu == "EditTeachersDetail"
              ? "text-custom-green-2"
              : ""
          }`}
        />
      ),
      handler: () => handleMenuClick("Teachers"),
    },
    {
      name: "Calendar",
      icon: (
        <PiCalendarDotsLight
          size={20}
          className={`${
            isCollapsed && activeMenu === "Calendar"
              ? "text-custom-green-2"
              : ""
          }`}
        />
      ),
      handler: () => handleMenuClick("Calendar"),
    },
    {
      name: "About Us",
      icon: (
        <PiQuestionMarkLight
          size={20}
          className={`${
            isCollapsed && activeMenu === "About Us"
              ? "text-custom-green-2"
              : ""
          }`}
        />
      ),
      handler: () => handleMenuClick("About Us"),
    },
    {
      name: "Settings",
      icon: (
        <PiGearLight
          size={20}
          className={`${
            isCollapsed && showAccordion ? "text-custom-green-2" : ""
          }`}
        />
      ),
      handler: handleAccordion,
    },
  ];

  const settingsSubMenu = [
    {
      name: "Profile",
      handler: () => handleMenuClick("Profile"),
      icon: (
        <PiUserCircleLight
          size={20}
          className={`hover:text-custom-green-2 ${
            isCollapsed && showAccordion && activeMenu === "Profile"
              ? "text-custom-green-2"
              : ""
          }`}
        />
      ),
    },
    {
      name: "Change Password",
      handler: () => handleMenuClick("Change Password"),
      icon: (
        <PiLockSimpleOpenLight
          size={20}
          className={`hover:text-custom-green-2 ${
            isCollapsed && showAccordion && activeMenu === "Change Password"
              ? "text-custom-green-2"
              : ""
          }`}
        />
      ),
    },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } pl-5 flex flex-col justify-between my-7 transition-all duration-300`}
    >
      <div>
        <div
          className={`flex flex-row ${
            isCollapsed ? "justify-center" : "justify-between"
          } border-b-2 border-slate-300 pb-2 items-center`}
        >
          <span>
            {isLoggedIn ? (
              <div
                onClick={isCollapsed ? toggleCollapse : () => console.log("")}
                className={`flex items-center gap-4 ${
                  isCollapsed ? "cursor-pointer" : ""
                }`}
              >
                <LuSchool size={30} />
                {!isCollapsed && (
                  <h1 className="font-semibold text-xl text-custom-black-1">
                    {schools?.name}
                  </h1>
                )}
              </div>
            ) : (
              <h1 className="font-semibold text-xl text-custom-white-1">
                Welcome
              </h1>
            )}
          </span>
          <button
            onClick={toggleCollapse}
            className={`border border-slate-200 bg-slate-100 p-1 h-6 rounded-md flex items-center justify-center ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            <HiChevronDoubleLeft
              size={15}
              className={`transform ${isCollapsed ? "rotate-180" : "rotate-0"}`}
            />
          </button>
        </div>
        <div className="mt-5">
          <ul className="space-y-5">
            {mainMenu.map((val, index) => (
              <div key={index}>
                <div
                  className={`${
                    isCollapsed ? "place-content-center" : ""
                  } flex flex-row ease-in-out duration-300 `}
                >
                  <button
                    key={index}
                    className={`ease-in-out duration-300 text-custom-black-1 flex flex-row items-center`}
                    onClick={val.handler}
                    disabled={!isLoggedIn}
                  >
                    <div className="flex items-center gap-3">
                      {val.icon}
                      <p
                        className={`duration-300 ease-in-out ${
                          isCollapsed ? "hidden" : "block"
                        } ${
                          activeMenu === val.name ||
                          activeMenu === "News" ||
                          activeMenu === `${val.name}Detail`
                            ? "text-custom-green-2 pl-3"
                            : "text-custom-black-1"
                        }`}
                      >
                        {val.name}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </ul>
          <div
            className={`${
              isCollapsed ? "text-center" : ""
            } font-semibold text-xs text-slate-500 mt-5`}
          >
            {isCollapsed ? "Main" : "Main Contents"}
          </div>
          <ul className="space-y-5 mt-2">
            {managementMenu.map((val, index) => (
              <div key={index}>
                <div
                  className={`${
                    isCollapsed ? "place-content-center" : ""
                  } flex flex-row ease-in-out duration-300`}
                >
                  <button
                    key={index}
                    className={`ease-in-out duration-300 text-custom-black-1 ${
                      val.name === "Settings" ? "w-full" : ""
                    }`}
                    onClick={val.handler}
                    disabled={!isLoggedIn}
                  >
                    <div
                      className={`flex items-center gap-3 ${
                        isCollapsed ? "justify-center" : "justify-between"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {val.icon}
                        <p
                          className={`duration-300 ease-in-out ${
                            isCollapsed ? "hidden" : "block"
                          } ${
                            activeMenu === val.name ||
                            activeMenu === `${val.name}Detail` ||
                            (activeMenu === "AttendanceDetail" &&
                              val.name === "Students") ||
                            (showAccordion && val.name === "Settings") ||
                            activeMenu === `Edit${val.name}Detail`
                              ? "text-custom-green-2 pl-3"
                              : "text-custom-black-1"
                          }`}
                        >
                          {val.name}
                        </p>
                      </span>
                      {val.name === "Settings" && !isCollapsed && (
                        <PiCaretRightLight
                          size={20}
                          className={`duration-300 ease-in-out ${
                            showAccordion ? "text-custom-green-2 rotate-90" : ""
                          }`}
                        />
                      )}
                    </div>
                  </button>
                </div>
                {val.name === "Settings" && showAccordion && (
                  <ul
                    className={`${
                      isCollapsed ? "" : "pl-8"
                    } mt-3 space-y-3 duration-300 ease-in-out `}
                  >
                    {settingsSubMenu.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        onClick={subItem.handler}
                        className={`text-custom-black-1 ease-in-out duration-300 flex items-center gap-3 cursor-pointer ${
                          isCollapsed ? "place-content-center" : ""
                        }`}
                      >
                        {subItem.icon}
                        <button
                          className={`ease-in-out duration-300 ${
                            isCollapsed ? "hidden" : "block"
                          } ${
                            activeMenu === subItem.name
                              ? "text-custom-green-2 pl-3"
                              : "text-custom-black-1"
                          }`}
                        >
                          {subItem.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
      {isLoggedIn && (
        <div
          onClick={onLogout!}
          className={`flex items-center cursor-pointer group ease-in-out hover:text-custom-error-2 duration-300 ${
            isCollapsed ? "place-content-center gap-0" : "gap-3 hover:gap-6"
          }`}
        >
          <div className="relative w-5 h-5">
            <PiLockLight
              size={20}
              className="absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0"
            />
            <PiLockOpenLight
              size={20}
              className="absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
            />
          </div>
          <button className={`ease-in-out duration-300`}>
            <p className={`capitalize ${isCollapsed ? "hidden" : "block"} `}>
              {user?.name || "admin"}
            </p>
          </button>
        </div>
      )}
    </div>
  );
}

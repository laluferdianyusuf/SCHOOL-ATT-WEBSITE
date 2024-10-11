import { ReactNode } from "react";
import { Student, Teacher } from "../types/types";
import { Dropdown } from "./Dropdown";
import { PiDotsThreeLight } from "react-icons/pi";

interface TableHeaderOption {
  head: string;
  icon: ReactNode;
}

interface DropdownOption {
  name: string;
  value: string;
  icon: ReactNode;
}

interface TableProps<T> {
  header?: TableHeaderOption[];
  body?: Array<T>;
  options: DropdownOption[];
  selected: (action: string, id: string) => void;
  selectedId: string | null;
  handleDropdownOpen: (id: string) => void;
  isDropdownOpen?: boolean;
  handleStudentSelect: (id: string) => void;
}

export const Table = <T extends Student | Teacher>({
  header = [],
  body = [],
  options,
  selected,
  selectedId,
  handleDropdownOpen,
  isDropdownOpen,
  handleStudentSelect,
}: TableProps<T>) => {
  return (
    <div
      className={`${
        isDropdownOpen ? "" : "overflow-x-auto"
      } shadow-md rounded-sm shadow-custom-green-3`}
    >
      <table className="table w-full">
        <thead className="bg-custom-green-3">
          <tr className="border-none">
            {header.map(({ head, icon }, index) => (
              <th
                key={index}
                className={index < header.length - 1 ? "" : "w-3"}
              >
                <div
                  className={`flex flex-row ${
                    index < header.length - 1
                      ? "justify-between"
                      : "justify-center"
                  } items-center py-[4.5px] `}
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    {index < header.length - 1 && <p>{head}</p>}
                  </div>
                  {index < header.length - 1 && (
                    <div className="w-[2px] rounded-full bg-slate-200 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((item, index) => {
            const id =
              (item as Student).id?.toString() ||
              (item as Teacher).id?.toString();
            const attendanceMap = (item as Student).attendances?.map(
              (att) => att.present
            );

            return (
              <tr
                key={index}
                className={`border-none ${
                  index % 2 === 0 ? "bg-white" : "bg-custom-green-3"
                }`}
              >
                <td>
                  <div className="flex items-center gap-3 capitalize">
                    {(item as Student).name || (item as Teacher).name}
                  </div>
                </td>
                <td>
                  {(item as Student).address ||
                    (item as Teacher).address ||
                    "none"}
                </td>
                <td>
                  {(item as Student).classroom ||
                    (item as Teacher).born ||
                    "none"}
                </td>
                <td>
                  {(item as Student).gender ||
                    (item as Teacher).gender ||
                    "none"}
                </td>
                <td>
                  <div className="capitalize">
                    {(item as Student).attendances
                      ? attendanceMap?.length! > 0
                        ? attendanceMap
                        : "no record"
                      : (item as Teacher).religion || "none"}
                  </div>
                </td>
                <td>
                  <button
                    className="hover:text-custom-green-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStudentSelect(id!);
                    }}
                  >
                    Details
                  </button>
                </td>
                <td className="relative">
                  <button
                    className="btn btn-ghost btn-xs hover:text-custom-green-2 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDropdownOpen(id!);
                    }}
                  >
                    <PiDotsThreeLight size={15} />
                  </button>
                  {isDropdownOpen && selectedId === id && (
                    <Dropdown
                      onSelect={(action) => selected(action, id!)}
                      options={options}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

import React, { ReactNode } from "react";
import { PiSubtitlesLight } from "react-icons/pi";

interface TableBodyProps {
  label: string;
  value?: string;
  icon: ReactNode;
}

interface TableProps {
  item?: TableBodyProps[];
}

export const TableDetails: React.FC<TableProps> = ({
  item = [],
}) => {
  console.log(item);

  if (!item) return <p>No data available</p>;

  return (
    <div className="overflow-x-auto shadow-md flex-1 shadow-custom-green-3 rounded-sm">
      <table className="table w-full border border-custom-green-3">
        <thead className="border-b-2 border-slate-100">
          <tr className="border-none">
            <th className="text-left flex gap-2">
              <span className="w-10">
                <PiSubtitlesLight size={15} color="#0d9485" />
              </span>
              <span className="flex-1 text-custom-green-2">Title</span>
            </th>
            <th className="text-left text-custom-green-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {item.map(
            (row, index) => (
              (
                <tr key={index} className="border-b border-custom-green-3">
                  <td className="py-2 px-4 font-medium text-slate-600 flex items-center gap-2">
                    <span className="w-10">{row.icon || null}</span>
                    <span className="flex-1 text-custom-green-2">
                      {row.label}
                    </span>
                  </td>
                  <td
                    className={`py-2 px-4 text-slate-500 ${
                      row.label === "Name" ? "capitalize" : ""
                    }`}
                  >
                    {row.value}
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

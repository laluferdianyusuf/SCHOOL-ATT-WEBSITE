import { ReactNode, useEffect } from "react";
import { Button } from "./Button";

interface ModalProps {
  title: string;
  children?: ReactNode;
  functionCancel: () => void;
  functionOk: () => void;
  textCancel: string;
  textOk: string;
  headText: string;
  isOpen: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  functionCancel,
  functionOk,
  textCancel,
  textOk,
  headText = "School Attendance",
  isOpen,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        functionCancel();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, functionCancel]);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).classList.contains("modal-backdrop")) {
      functionCancel();
    }
  };
  return isOpen ? (
    <div
      className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      onClick={handleClickOutside}
    >
      <div className="bg-custom-white-1 rounded-lg flex flex-col gap-5 py-6 px-14 relative w-[40%] max-h-[90vh] overflow-y-auto">
        <div className="font-semibold text-center">
          <h4 className="text-slate-300 text-[10px] mb-1">{headText}</h4>
          <h3 className="text-slate-900 text-lg">{title}</h3>
        </div>
        {children}

        <div className="flex justify-center gap-5 mt-2">
          {functionCancel && textCancel && (
            <Button
              style="bg-gray-300 px-3 py-1 rounded-md"
              handle={functionCancel}
            >
              <p className="text-custom-black-1 text-xs">{textCancel} </p>
            </Button>
          )}
          <Button
            style="bg-custom-green-1 px-3 py-1 rounded-md"
            handle={functionOk}
          >
            <p className="text-white  text-xs">{textOk} </p>
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};

import { Modal } from "./Modal";
import { InputField } from "./InputField";
import { ReactNode } from "react";

interface ExtraFieldsProps {
  label: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAddress?: boolean;
}

interface ModalCrudProps {
  title: string;
  functionCancel: () => void;
  functionOk: () => void;
  textCancel: string;
  textOk: string;
  headText: string;
  isOpen: boolean;
  isDisabled?: boolean;
  inputValue: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputName: string;
  placeholder?: string;
  inputType: "text" | "password" | "email";
  inputLabel: string;
  extraFields?: ExtraFieldsProps[];
  children?: ReactNode;
}

export const ModalCrud: React.FC<ModalCrudProps> = ({
  title,
  functionCancel,
  functionOk,
  textCancel,
  textOk,
  headText,
  inputValue,
  onChange,
  inputName,
  placeholder,
  inputType = "text",
  inputLabel,
  isOpen,
  isDisabled = false,
  extraFields = [],
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      functionCancel={functionCancel}
      functionOk={functionOk}
      textCancel={textCancel}
      textOk={textOk}
      headText={headText}
    >
      <InputField
        isDisabled={isDisabled}
        label={inputLabel}
        name={inputName}
        value={inputValue}
        placeholder={placeholder}
        onChange={onChange}
        labelStyle="text-xs text-black"
        type={inputType}
        style="capitalize"
      />
      {extraFields.map((field, index) => (
        <div key={index}>
          {field.name === "born" ? (
            <div className="relative flex flex-col gap-3" key={index}>
              <InputField
                key={index}
                isDisabled={isDisabled}
                label={field.label}
                name={field.name}
                value={field.value}
                placeholder={field.placeholder}
                onChange={field.onChange}
                labelStyle="text-xs text-black"
                type={inputType}
              />
              {children}
            </div>
          ) : (
            <InputField
              key={index}
              isDisabled={isDisabled}
              label={field.label}
              name={field.name}
              value={field.value}
              placeholder={field.placeholder}
              onChange={field.onChange}
              labelStyle="text-xs text-black"
              type={inputType}
            />
          )}
        </div>
      ))}
    </Modal>
  );
};

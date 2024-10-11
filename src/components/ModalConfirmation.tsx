import { Modal } from "./Modal";

interface ModalConfirmationProps {
  title: string;
  textCancel: string;
  textOk: string;
  functionCancel: () => void;
  functionOk: () => void;
  isOpen: boolean;
  headText?: string;
  isLoading?: boolean;
}

export const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  title,
  textCancel,
  textOk,
  functionCancel,
  functionOk,
  isOpen,
  headText = "School Attendances",
}) => {
  return (
    <Modal
      title={title}
      functionCancel={functionCancel}
      functionOk={functionOk}
      textCancel={textCancel}
      textOk={textOk}
      isOpen={isOpen}
      headText={headText}
    />
  );
};

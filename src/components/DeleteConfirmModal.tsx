import type { Customer } from "../interface/customer";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  customer: Customer | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({
  isOpen,
  customer,
  isSubmitting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#e53e3e]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-center text-[#2d3748] mb-2">
            Delete Customer
          </h3>

          <p className="text-center text-[#4a5568] mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {customer.firstName} {customer.lastName}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="bg-[#cbd5e0] text-[#2d3748] py-3 px-6 text-base font-bold border-none rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#a0aec0] font-['JetBrains_Mono',monospace]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="bg-[#e53e3e] text-white py-3 px-6 text-base font-bold border-none rounded-xl cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_12px_rgba(229,62,62,0.4)] hover:bg-[#c53030] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(229,62,62,0.6)] active:translate-y-0 disabled:bg-[#a0aec0] disabled:cursor-not-allowed font-['JetBrains_Mono',monospace]"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

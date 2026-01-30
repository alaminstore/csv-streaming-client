interface ErrorNotificationProps {
  message: string | null;
  onClose: () => void;
}

const ErrorNotification = ({ message, onClose }: ErrorNotificationProps) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-[#e53e3e] text-white px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(229,62,62,0.4)] flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 transition-colors cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;


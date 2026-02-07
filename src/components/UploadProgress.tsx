interface UploadProgressProps {
  progress: number;
  processed: number;
  totalRows: number;
  elapsed: number;
  eta: number;
  isUploading: boolean;
  error: string | null;
  onStartSync: () => void;
  formatTime: (seconds: number) => string;
}

const UploadProgress = ({
  progress,
  processed,
  totalRows,
  elapsed,
  eta,
  isUploading,
  error,
  onStartSync,
  formatTime,
}: UploadProgressProps) => {
  return (
    <div className="relative overflow-hidden bg-white/95 backdrop-blur-[10px] p-4 mb-2 border-[3px] border-[#3f9177] rounded-[10px]">
      <div className="flex items-center justify-between">
        <div className="w-9/12">
          <div className="text-[25px] text-[#2d3748] mb-5 tracking-[-0.5px]">
            Upload progress: {Math.round(progress)}%
          </div>

          <div className="relative h-[50px] bg-[#e2e8f0] rounded-[25px] overflow-hidden border-[3px] border-[#0C9268] mb-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
            <div
              className="progress-bar-fill h-full bg-gradient-to-r from-[#9fdbc7] to-[#62a48f] rounded-full border-[3px] border-[#0C9268] transition-[width] duration-300 ease-in-out relative overflow-hidden"
              style={{ width: `${Math.round(progress)}%` }}
            />
            {progress < 100 && (
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-r from-[#e2e8f0] to-[#cce7de]"
                style={{ width: `${100 - Math.round(progress)}%` }}
              />
            )}
          </div>
          <div className="text-lg text-[#4a5568] font-semibold mb-6">
            Processed: {processed.toLocaleString()} / {totalRows.toLocaleString()}{" "}
            | Elapsed: {formatTime(elapsed)} | ETA: {formatTime(eta)}
          </div>
        </div>

        <div className="w-3/12">
          <button
            className="bg-[#3f9177] text-white py-4 px-8 text-xl border-none rounded-[10px] cursor-pointer float-right hover:bg-[#37846b] disabled:bg-[#a0aec0] disabled:cursor-not-allowed"
            onClick={onStartSync}
            disabled={isUploading}
          >
            {isUploading ? "Syncing..." : "Start sync"}
          </button>
        </div>
      </div>

      <div className="clear-both"></div>
    </div>
  );
};

export default UploadProgress;


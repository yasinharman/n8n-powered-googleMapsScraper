import { formatBytes } from "@/lib/format";

interface ResultCardProps {
  filename: string;
  fileSize: number;
  downloadUrl: string;
  onNewSearch: () => void;
}

export default function ResultCard({
  filename,
  fileSize,
  downloadUrl,
  onNewSearch,
}: ResultCardProps) {
  return (
    <div className="flex w-full flex-col items-center gap-5 py-4">
      {/* Success icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-900/50">
        <svg
          className="h-6 w-6 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      {/* File info */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-200">{filename}</p>
        <p className="mt-1 text-xs text-gray-500">{formatBytes(fileSize)}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href={downloadUrl}
          download={filename}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500"
        >
          İndir
        </a>
        <button
          onClick={onNewSearch}
          className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
        >
          Yeni Arama
        </button>
      </div>
    </div>
  );
}

interface ErrorBannerProps {
  message: string;
  details?: string;
  onRetry: () => void;
}

export default function ErrorBanner({ message, details, onRetry }: ErrorBannerProps) {
  return (
    <div className="w-full rounded-lg border border-red-500/50 bg-red-950/60 p-4">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-red-200">{message}</p>
          {details && (
            <details className="text-xs text-red-300/70">
              <summary className="cursor-pointer hover:text-red-200">
                Teknik detaylar
              </summary>
              <pre className="mt-1 whitespace-pre-wrap break-all rounded bg-red-950/80 p-2 font-mono">
                {details}
              </pre>
            </details>
          )}
          <button
            onClick={onRetry}
            className="mt-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    </div>
  );
}

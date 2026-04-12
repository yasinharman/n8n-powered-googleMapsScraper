import { formatElapsedTime } from "@/lib/format";

const MESSAGES = [
  "Sorgunuz analiz ediliyor...",
  "Google Maps'te aranıyor...",
  "Sonuçlar işleniyor...",
  "Excel dosyası hazırlanıyor...",
];

interface LoadingStateProps {
  elapsedSeconds: number;
}

export default function LoadingState({ elapsedSeconds }: LoadingStateProps) {
  const messageIndex = Math.floor(elapsedSeconds / 13) % MESSAGES.length;

  return (
    <div className="flex w-full flex-col items-center gap-5 py-4">
      {/* Spinner */}
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-700 border-t-blue-500" />

      {/* Rotating message */}
      <p className="text-sm font-medium text-gray-300 transition-opacity duration-500">
        {MESSAGES[messageIndex]}
      </p>

      {/* Elapsed time */}
      <p className="text-xs text-gray-500">
        Geçen süre: {formatElapsedTime(elapsedSeconds)}
      </p>
    </div>
  );
}

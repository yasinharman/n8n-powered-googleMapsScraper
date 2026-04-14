"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import { parseFilename } from "@/lib/format";
import SearchForm from "./SearchForm";
import LoadingState from "./LoadingState";
import ResultCard from "./ResultCard";
import ErrorBanner from "./ErrorBanner";

type AppState =
  | { status: "idle" }
  | { status: "loading"; startTime: number }
  | { status: "success"; filename: string; fileSize: number; downloadUrl: string }
  | { status: "error"; message: string; details?: string };

type Action =
  | { type: "START" }
  | { type: "SUCCESS"; filename: string; fileSize: number; downloadUrl: string }
  | { type: "ERROR"; message: string; details?: string }
  | { type: "RESET" };

function reducer(_state: AppState, action: Action): AppState {
  switch (action.type) {
    case "START":
      return { status: "loading", startTime: Date.now() };
    case "SUCCESS":
      return {
        status: "success",
        filename: action.filename,
        fileSize: action.fileSize,
        downloadUrl: action.downloadUrl,
      };
    case "ERROR":
      return { status: "error", message: action.message, details: action.details };
    case "RESET":
      return { status: "idle" };
  }
}

interface MainContentProps {
  maxMessageLength: number;
}

export default function MainContent({ maxMessageLength }: MainContentProps) {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });
  const [elapsedSeconds] = useElapsedTimer(
    state.status === "loading" ? state.startTime : null
  );
  const downloadUrlRef = useRef<string | null>(null);

  const reset = useCallback(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }
    dispatch({ type: "RESET" });
  }, []);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current);
      }
    };
  }, []);

  async function handleSubmit(message: string) {
    dispatch({ type: "START" });

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok || contentType.includes("application/json")) {
        const data = await res.json();
        dispatch({
          type: "ERROR",
          message: data.error || "Bilinmeyen bir hata oluştu",
          details: data.details,
        });
        return;
      }

      const blob = await res.blob();
      const filename =
        parseFilename(res.headers.get("content-disposition")) ||
        "google-maps-sonuclar.xlsx";
      const url = URL.createObjectURL(blob);
      downloadUrlRef.current = url;

      dispatch({
        type: "SUCCESS",
        filename,
        fileSize: blob.size,
        downloadUrl: url,
      });
    } catch {
      dispatch({
        type: "ERROR",
        message: "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.",
      });
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-orange-500">
            Google Maps Veri Kazıyıcı
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Aradığınız işletmeleri yazın, Excel dosyası olarak indirin
          </p>
        </div>

        {/* State-based content */}
        {state.status === "idle" && (
          <SearchForm
            onSubmit={handleSubmit}
            maxLength={maxMessageLength}
            disabled={false}
          />
        )}

        {state.status === "loading" && (
          <LoadingState elapsedSeconds={elapsedSeconds} />
        )}

        {state.status === "success" && (
          <ResultCard
            filename={state.filename}
            fileSize={state.fileSize}
            downloadUrl={state.downloadUrl}
            onNewSearch={reset}
          />
        )}

        {state.status === "error" && (
          <div className="space-y-4">
            <ErrorBanner
              message={state.message}
              details={state.details}
              onRetry={reset}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function useElapsedTimer(startTime: number | null): [number] {
  const [elapsed, setElapsed] = useReducer((_: number, n: number) => n, 0);

  useEffect(() => {
    if (startTime === null) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return [elapsed];
}

"use client";

import { useState } from "react";

interface SearchFormProps {
  onSubmit: (message: string) => void;
  maxLength: number;
  disabled: boolean;
}

export default function SearchForm({ onSubmit, maxLength, disabled }: SearchFormProps) {
  const [message, setMessage] = useState("");

  const trimmed = message.trim();
  const isOverLimit = trimmed.length > maxLength;
  const isEmpty = trimmed.length === 0;
  const canSubmit = !disabled && !isEmpty && !isOverLimit;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) {
      onSubmit(trimmed);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) {
        onSubmit(trimmed);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Örn: Kadıköy'deki pizzacıları bul"
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none disabled:opacity-50"
        />
        <span
          className={`absolute right-3 bottom-3 text-xs ${
            isOverLimit ? "text-red-400" : "text-gray-500"
          }`}
        >
          {trimmed.length} / {maxLength}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Arama 1 dakika kadar sürebilir</p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Ara
        </button>
      </div>
    </form>
  );
}

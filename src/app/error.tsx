"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-white/60 mb-8 max-w-md">{error.message || "An unexpected error occurred."}</p>
      <button
        className="bg-[#B21E35] px-6 py-2 rounded-full font-bold hover:bg-[#8B0000] transition-colors"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}

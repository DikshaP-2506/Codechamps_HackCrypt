"use client";

export function useToast() {
  const toast = ({ title, description }: { title?: string; description?: string }) => {
    if (typeof window !== "undefined") {
      // minimal browser fallback for toast in dev
      try {
        alert(`${title || ""}${description ? "\n" + description : ""}`);
      } catch {
        // ignore
      }
    } else {
      // server-side fallback
      // eslint-disable-next-line no-console
      console.log("toast:", title, description);
    }
  };

  return { toast };
}

export default useToast;

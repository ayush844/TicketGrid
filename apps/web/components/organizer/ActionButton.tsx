"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  label: string;
  endpoint: string;
  color: "green" | "red";
};

export default function ActionButton({ label, endpoint, color }: Props) {
  const router = useRouter();

  const handleClick = async () => {
    const confirmAction = confirm(`Are you sure you want to ${label}?`);
    if (!confirmAction) return;
    try {
      const res = await fetch(`/api${endpoint}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Action failed");
      }

      router.refresh(); // 🔥 refresh server data

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const colorClass =
    color === "green"
      ? "text-green-400 hover:text-green-300"
      : "text-red-400 hover:text-red-300";

  return (
    <button
      onClick={handleClick}
      className={`text-xs ${colorClass}`}
    >
      {label}
    </button>
  );
}
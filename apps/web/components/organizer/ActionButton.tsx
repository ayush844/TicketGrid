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

  const handleAction = async () => {
    try {
      const res = await fetch(`/api${endpoint}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Action failed");
      }

      toast.success(`${label} successful`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleClick = () => {
    toast(`Are you sure you want to ${label}?`, {
      action: {
        label: "Confirm",
        onClick: handleAction,
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const colorClass =
    color === "green"
      ? "text-green-400 hover:text-green-300"
      : "text-red-400 hover:text-red-300";

  return (
    <button onClick={handleClick} className={`text-xs ${colorClass}`}>
      {label}
    </button>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ROLES } from "@/lib/constants";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "./ui/button";

export default function HomeButtons() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleExplore = () => {
    router.push("/events");
  };

  const handleCreateEvent = () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    if (session.user.role !== ROLES.ORGANIZER) {
      toast.error("Only organizers can create events. Sign up as an organizer.");
      return;
    }

    router.push("/organizer/create");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
      <Button
        size={"lg"}
        onClick={handleExplore}
        className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-600"
      >
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Explore Events
      </Button>

      <Button
        size={"lg"}
        onClick={handleCreateEvent}
        className="w-full sm:w-auto border-2 border-white/10 bg-white/5 hover:bg-white/10 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-700"
      >
        Create Event
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
      </Button>
    </div>
  );
}
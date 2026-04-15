import FeaturedEvents from "@/components/FeaturedEvents";
import ForOrganizers from "@/components/ForOrganizers";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import { getEvents } from "@/lib/api";
import { callBackend } from "@/lib/protectedApi";

export default async function Home() {

  getEvents();
  return (
    <div className=" min-h-screen">
      <Hero />
      <FeaturedEvents />
      <HowItWorks />
      <ForOrganizers />
      <WhyChoose />
    </div>
  );
}

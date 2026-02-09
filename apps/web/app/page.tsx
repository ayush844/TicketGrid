import FeaturedEvents from "@/components/FeaturedEvents";
import ForOrganizers from "@/components/ForOrganizers";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";

export default function Home() {
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

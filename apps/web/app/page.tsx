import FeaturedEvents from "@/components/FeaturedEvents";
import ForOrganizers from "@/components/ForOrganizers";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import { callBackend } from "@/lib/api";

export default async function Home() {

  const data1 = await callBackend("/test/less-protected");
  console.log("Data from less-protected route:", data1);


  const data2 = await callBackend("/test/protected");
  console.log("Data from protected route:", data2);

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

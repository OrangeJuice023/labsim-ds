import { DataConstellation } from "@/components/home/DataConstellation";
import { WhyShowcase } from "@/components/home/WhyShowcase";
import { ProjectGrid } from "@/components/home/ProjectGrid";

export default function HomePage() {
  return (
    <>
      <DataConstellation />
      <WhyShowcase />
      <ProjectGrid />
    </>
  );
}

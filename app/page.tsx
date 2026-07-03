import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import Watermark from "@/components/dashboard/Watermark";
import HeroSection from "@/components/dashboard/HeroSection";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import StatsBar from "@/components/dashboard/StatsBar";
import FloatingActions from "@/components/dashboard/FloatingActions";
import PersianClock from "@/components/ui/PersianClock";
import Newsletter from "@/components/ui/Newsletter";

export default function DashboardPage() {
  return (
    <>
      <Watermark />
      <TopNav />

      <main className="relative z-10 pt-24 pb-20 px-4 md:px-6 max-w-6xl mx-auto flex flex-col gap-12">
        <HeroSection />
        <PersianClock />
        <ProjectGrid />
        <StatsBar />
        <Newsletter />
      </main>

      <FloatingActions />
      <Footer />
    </>
  );
}

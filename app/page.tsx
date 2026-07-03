import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/dashboard/HeroSection";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import StatsBar from "@/components/dashboard/StatsBar";
import FloatingActions from "@/components/dashboard/FloatingActions";
import PersianClock from "@/components/ui/PersianClock";
import Newsletter from "@/components/ui/Newsletter";

export default function DashboardPage() {
  return (
    <>
      <TopNav />

      <main className="relative z-10 pt-20 pb-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-10">
          <HeroSection />
          <PersianClock />
          <ProjectGrid />
          <StatsBar />
          <Newsletter />
        </div>
      </main>

      <FloatingActions />
      <Footer />
    </>
  );
}

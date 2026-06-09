import DreamPlan from "@/components/landing/hero";
import Featured from "@/components/landing/Featured";
import Explorer from "@/components/landing/Explorer";
import DesignJourney from "@/components/landing/DesignJourney";
import SocialProof from "@/components/landing/SocialProof";
import DesignIdeas from "@/components/landing/DesignIdeas";
import ContactForm from "@/components/landing/ContactForm";
import RuinsBackground from "@/components/landing/RuinsBackground";

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#141414' }} className="relative">
      <style dangerouslySetInnerHTML={{ __html: `html { scroll-behavior: smooth; }` }} />
      {/* Bricks sit above page content (z-10) but below nav (z-50).
          Must live OUTSIDE the z-10 stacking context so that
          position:fixed on the ruins-wrapper resolves correctly. */}
      <RuinsBackground />
      <div className="relative z-10">
        <DreamPlan />
        <Featured />
        <Explorer />
        <DesignJourney />
        <SocialProof />
        <DesignIdeas />
        <ContactForm />
      </div>
    </div>
  );
}

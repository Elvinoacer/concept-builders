import DreamPlan from "./_components/hero";
import Featured from "./_components/Featured";
import Explorer from "./_components/Explorer";
import DesignJourney from "./_components/DesignJourney";
import SocialProof from "./_components/SocialProof";
import DesignIdeas from "./_components/DesignIdeas";
import ContactForm from "./_components/ContactForm";
import RuinsBackground from "./_components/RuinsBackground";

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#141414' }} className="relative">
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
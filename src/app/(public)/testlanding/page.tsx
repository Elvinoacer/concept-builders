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
      <div className="relative z-10">
        <DreamPlan />
        <Featured />
        <Explorer />
        <DesignJourney />
        <SocialProof />
        <DesignIdeas />
        <ContactForm />
      </div>
      <RuinsBackground />
    </div>
  );
}
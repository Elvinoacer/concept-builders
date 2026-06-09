import DreamPlan from "@/components/landing/hero";
import Featured from "@/components/landing/Featured";
import Explorer from "@/components/landing/Explorer";
import DesignJourney from "@/components/landing/DesignJourney";
import SocialProof from "@/components/landing/SocialProof";
import DesignIdeas from "@/components/landing/DesignIdeas";
import ContactForm from "@/components/landing/ContactForm";

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#141414' }} className="relative">
      <style dangerouslySetInnerHTML={{ __html: `html { scroll-behavior: smooth; }` }} />
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

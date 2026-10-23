import {
  ArrowUpRight,
  Compass,
  DraftingCompass,
  FileCheck2,
  MessagesSquare,
} from "lucide-react";
import "./DesignJourney.css";

const steps = [
  {
    icon: Compass,
    title: "Tell us about your project",
    description:
      "Share your plot size, budget, family needs, and preferred style.",
  },
  {
    icon: DraftingCompass,
    title: "We develop the design",
    description:
      "Our architects create a concept that balances appearance, functionality, and buildability.",
  },
  {
    icon: MessagesSquare,
    title: "Review & refine",
    description:
      "We adjust the design until it feels right for your family and future plans.",
  },
  {
    icon: FileCheck2,
    title: "Receive ready-to-build drawings",
    description:
      "Complete architectural plans prepared for approvals and construction.",
  },
];

export default function DesignJourney() {
  return (
    <section
      className="design-process"
      id="journey"
      aria-labelledby="process-heading"
    >
      <div className="design-process__intro">
        <p>From the first idea to the first brick</p>
        <h2 id="process-heading">
          A considered process.
          <br />A confident <em>beginning.</em>
        </h2>
        <div>
          From hand-drafted concepts to construction-ready documents, we turn
          your idea of home into something you can build.
        </div>
      </div>
      <ol className="design-process__steps">
        {steps.map(({ icon: Icon, title, description }, index) => (
          <li key={title}>
            <span className="design-process__number">0{index + 1}</span>
            <Icon size={28} strokeWidth={1} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
      <div className="design-process__footer">
        <p>Your plot. Your family. Your way of living.</p>
        <a href="#consultation-form">
          Let’s talk about your home{" "}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

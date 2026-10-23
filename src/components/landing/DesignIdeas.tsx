import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import "./DesignIdeas.css";

type Collection = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image: string;
  category?: { name: string } | null;
};
const benefits = [
  [
    "Designed for real Kenyan plots",
    "Whether you own a 40×80, 50×100, or larger parcel, we create designs that maximize your space.",
  ],
  [
    "Avoid expensive mistakes",
    "Design issues discovered during construction are costly. We solve them before building begins.",
  ],
  [
    "Customisation comes standard",
    "Need more bedrooms, a larger kitchen, a home office, or future expansion space? We tailor plans around your needs.",
  ],
  [
    "Support beyond drawings",
    "We guide you through approvals, planning, and construction considerations.",
  ],
];
const guides = [
  "Open-Plan Living: Pros, Cons & Plan Types",
  "Bungalow vs Two-Storey: Which Suits Your Plot?",
  "Courtyard Home Design: Light, Air & Privacy",
  "Eco-Friendly Home Plans for Sustainable Living",
];

export default function DesignIdeas({
  collections,
}: {
  collections: Collection[];
}) {
  return (
    <div className="home-ideas">
      {collections.length > 0 && (
        <section
          className="home-ideas__collections"
          aria-labelledby="collections-heading"
        >
          <p className="home-ideas__eyebrow">Curated collections</p>
          <div className="home-ideas__heading">
            <h2 id="collections-heading">
              Room for a little
              <br />
              <em>inspiration.</em>
            </h2>
            <p>
              Browse real projects, compare layouts, and discover ideas that
              match your lifestyle before making a decision.
            </p>
          </div>
          <div className="home-ideas__grid">
            {collections.map((item) => (
              <Link
                href={
                  item.category
                    ? `/designs?category=${encodeURIComponent(item.category.name)}`
                    : "/designs"
                }
                key={item.id}
                className="home-ideas__collection"
              >
                <div>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 760px) 90vw, 30vw"
                  />
                </div>
                {item.subtitle && <span>{item.subtitle}</span>}
                <h3>
                  {item.title} <ArrowUpRight size={19} aria-hidden="true" />
                </h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section
        className="home-ideas__trust"
        id="consultation"
        aria-labelledby="trust-heading"
      >
        <div>
          <p className="home-ideas__eyebrow">Why choose us</p>
          <h2 id="trust-heading">
            Good architecture.
            <br />
            <em>Grounded in trust.</em>
          </h2>
          <p>
            Expertise, transparency, and a commitment to quality, from the first
            conversation to construction.
          </p>
          <a href="#consultation-form">
            Book a free consultation{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <ol>
          {benefits.map(([title, description], index) => (
            <li key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="home-ideas__guides" aria-labelledby="guides-heading">
        <div className="home-ideas__guides-heading">
          <div>
            <p className="home-ideas__eyebrow">A little guidance</p>
            <h2 id="guides-heading">
              Before you <em>build.</em>
            </h2>
          </div>
          <Link href="/blog">
            Visit the journal <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div>
          {guides.map((title, index) => (
            <Link href="/blog" key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
      <div className="home-ideas__closing">
        <p>Building starts long before construction begins.</p>
        <span>
          The right design can save money, reduce stress, and prevent costly
          changes later.
        </span>
        <a href="#consultation-form">
          Talk to us before you break ground{" "}
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

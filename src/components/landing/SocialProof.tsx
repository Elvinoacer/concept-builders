import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import "./SocialProof.css";

export type SocialProofProject = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featuredImage: string | null;
  clientName: string | null;
  location: string | null;
  status: string;
  category: string;
};

export default function SocialProof({
  projects = [],
}: {
  projects?: SocialProofProject[];
}) {
  return (
    <section
      className="work-proof"
      id="testimonials"
      aria-labelledby="work-heading"
    >
      <div className="work-proof__heading">
        <div>
          <p>From plan to place</p>
          <h2 id="work-heading">
            The best proof
            <br />
            is <em>taking shape.</em>
          </h2>
        </div>
        <div>
          <p>
            Every project starts as a conversation and ends as a place people
            proudly call home.
          </p>
          <Link href="/ongoing-projects">
            Explore our ongoing projects{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
      {projects.length > 0 && (
        <div className="work-proof__projects">
          {projects.map((project) => (
            <Link
              href={`/ongoing-projects/${project.slug}`}
              className="work-proof__project"
              key={project.id}
            >
              {project.featuredImage && (
                <div className="work-proof__image">
                  <Image
                    src={project.featuredImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 760px) 90vw, 30vw"
                  />
                </div>
              )}
              <span>{project.status.replace(/_/g, " ").toLowerCase()}</span>
              <h3>
                {project.title}
                <ArrowUpRight size={18} aria-hidden="true" />
              </h3>
              {project.description && <p>{project.description}</p>}
              <div>
                {[project.clientName, project.location]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="work-proof__stats">
        {[
          ["22+", "Years designing homes across Kenya"],
          ["1,000+", "House plans delivered"],
          ["500+", "Successful residential projects"],
          ["Thousands", "Family members living in homes we helped design"],
        ].map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="work-proof__footer">
        <Link href="/ongoing-projects">
          View our work <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <Link href="/designs">
          Browse all plans <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

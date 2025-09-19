"use client";
import React from "react";
import ProjectsHeader from "@/components/dashboard/projects/ProjectsHeader";
import ProjectProgress from "@/components/dashboard/projects/ProjectProgress";
import Milestones from "@/components/dashboard/projects/Milestones";
import Payments from "@/components/dashboard/projects/Payments";
import ProjectUpdates from "@/components/dashboard/projects/ProjectUpdates";
import ProjectImages from "@/components/dashboard/projects/ProjectImages";

const ProjectsPage = () => {
  const project = {
    title: "Modern Residence",
    description:
      "Track the progress of your construction project in real-time.",
    progress: 65,
    estimatedCompletion: "December 15, 2024",
    milestones: [
      {
        id: 1,
        name: "Foundation",
        status: "Completed",
        dueDate: "July 15, 2024",
        statusColor: "green",
      },
      {
        id: 2,
        name: "Framing",
        status: "Completed",
        dueDate: "August 10, 2024",
        statusColor: "green",
      },
      {
        id: 3,
        name: "Electrical & Plumbing",
        status: "In Progress",
        dueDate: "September 20, 2024",
        statusColor: "blue",
      },
      {
        id: 4,
        name: "Drywall & Interior Finishing",
        status: "Upcoming",
        dueDate: "October 15, 2024",
        statusColor: "gray",
      },
    ],
    payments: [
      {
        id: 1,
        name: "Initial Deposit",
        amount: 50000,
        status: "Paid",
        date: "June 1, 2024",
        statusColor: "green",
      },
      {
        id: 2,
        name: "Framing Payment",
        amount: 75000,
        status: "Paid",
        date: "August 15, 2024",
        statusColor: "green",
      },
      {
        id: 3,
        name: "Electrical & Plumbing",
        amount: 100000,
        status: "Pending",
        date: "September 25, 2024",
        statusColor: "yellow",
      },
    ],
    projectManager: {
      name: "Sarah Johnson",
      role: "Project Manager",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB2TmWZUcPN69p5Qy1aMNVcJB5gFntvVRbo8khiwk82iEW22UiorsvEEqUZs_8pygYwU00c8QPWP7_gbRybJtVbXj-nYj5Y3T0OaSjIAmmjAMZ1nIz5Soi7hvNQ9hDgtuqH7GSAc5kRJAGLo84PUbBGBfMaKL8bam5KCFLerlxvjwPS_cdXelMKLLChC7M0iZWCLD9lh-E44Bm6_rc6nMpodU-XYinxfdWFiSNrjCm6Fi35ja3VUhULb4f_-a-GoedJRbP-ReKmDIae",
      latestUpdate:
        "The framing is complete, and electrical and plumbing installations are underway. We are on schedule and within budget. Next steps include drywall installation and interior finishing.",
    },
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCL-7fQD68DyrwHs8gWgu5H2MI3bVnmXSZJ89j1v3JPRUMu2addHM65nQxW4G7DRhr7hpqxy1fed4M0xNiyq6t_yncrG55oYQKxcv-ne1sVOQLAw8e-JtyHcjjq49tr2Dw9kp1UaIzzGI4OC64Hp8CgrKcGP2kDMgCiwwjj2sbl4KTK3-eFaJPJY8zk4b3H1iadaGK5mYnFSWUchIvKeRbCcMfCfNg3wq_q4v6FZlXYgUQG5D_4IUMKyhrLrHsqGexhEjlylNObhhVb",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJHHv7bC_VqgBTice09JLElRWiL22lXmBe2Tf4D9vvbDfIFlucdeo4WwgDviGFcaNKW1M0nCMJJAUvDPr6_eEcYP2nhl5vLtiqt7BtotNqqdJMkX2yyOR6Gh67trqNHGkt7oq7VsTPSO-rxiTl6bKDRI--L3ZFL3NTpAuFke0od4NU6L94LT4jtpVEFaQaMB8NlHxIgyLl7Hw--hZkeLvhMP2IdgFXcT4V8h9Mo2gQpciteKp79s7bOso9ZDamm7RNfRL094pN70GM",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD00lPQXMC2AavxwY0ur6WMZK-YObkrHMXfXkpE7MrYRG-5UzyPFaIzf3Rh3mDR6SOmCeiQztj-smMNQAOamwav_ZFI6Wq-OyofDA8KNB1Mgivk9iThGzjRppHTzDQVYOefPIxydrscoLfVyB8gKSsFMj_Vyu09mz0umGwShP29ee2Zu2gKxMvXq5XjWcvrusFD1tC42RsID3r5jQRFmlSnGeu0dA95dxSYnEiVJHqAMR2Dd99icavHeuOn4jsbgNAil3Lmqyjnqnap",
    ],
  };

  return (
    <div className="mx-auto max-w-6xl p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ProjectsHeader title={project.title} description={project.description} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <ProjectProgress
            progress={project.progress}
            estimatedCompletion={project.estimatedCompletion}
          />
          <Milestones milestones={project.milestones} />
          <Payments payments={project.payments} />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <ProjectUpdates projectManager={project.projectManager} />
          <ProjectImages images={project.images} />
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

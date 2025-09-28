"use client";
import { useApp } from "@/context/AppContext";

export default function EducationPage() {
  const { educationalContent, navigateToPage } = useApp();
  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Financial Education</h1>
        <button
          onClick={() => navigateToPage("dashboard")}
          className="pixel-btn pixel-btn--secondary"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {educationalContent.map((c) => (
          <div key={c.id} className="pixel-card p-4">
            <h3 className="font-bold mb-2">{c.title}</h3>
            <p className="text-[11px] opacity-90 mb-2">{c.description}</p>
            <div className="text-[11px] flex gap-3">
              <span className="pixel-badge bg-mc-blue text-white">
                {c.duration}
              </span>
              <span className="pixel-badge bg-mc-green text-white">
                +{c.points} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

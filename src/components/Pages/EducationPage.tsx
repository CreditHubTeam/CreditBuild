"use client";
import { useApp } from "@/context/AppContext";
import { useData } from "@/state/data";

export default function EducationPage() {
  const { handleNavigation } = useApp();
  const { userEducations, completeEducation } = useData();
  console.log(userEducations);
  // Tách 2 nhóm
  const incomplete = userEducations.filter((e) => !e.isCompleted);
  const completed = userEducations.filter((e) => e.isCompleted);

  const handleSubmitEducation = async (id: string) => {
    if (incomplete.length === 0) return;
    await completeEducation(id, { progress: 100, proof: {} });
  };

  return (
    <section className="container mx-auto px-4 py-6 pb-20 sm:pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Financial Education</h1>
        <button
          onClick={() => handleNavigation("/dashboard")}
          className="pixel-btn pixel-btn--secondary"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Incomplete first */}
      <h2 className="pixel-card p-2 text-xl mb-2 text-mc-blue">
        Courses To Complete
      </h2>
      <div className="grid md:grid-cols-2 gap-3 mb-8">
        {incomplete.length === 0 && (
          <p className="pixel-card p-2 text-sm opacity-70 col-span-full text-center">
            All courses completed 🎉
          </p>
        )}
        {incomplete.map((c) => (
          <div
            key={c.id}
            className="pixel-card p-4 border-mc-yellow"
            onClick={() => handleSubmitEducation(c.id.toString())}
          >
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

      {/* Completed below */}
      <h2 className="pixel-card p-2 text-xl mb-2 text-gray">
        Completed Courses
      </h2>
      <div className="grid md:grid-cols-2 gap-3 opacity-70">
        {completed.map((c) => (
          <div key={c.id} className="pixel-card p-4 bg-gray-800">
            <h3 className="font-bold mb-2 line-through">{c.title}</h3>
            <p className="text-[11px] opacity-80 mb-2">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

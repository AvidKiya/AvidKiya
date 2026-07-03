"use client";

import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import Editable from "@/components/cms/Editable";
import { AddButton, ListItem } from "@/components/cms/EditableList";
import Icon from "@/components/ui/Icon";
import type { DashboardProject } from "@/lib/cms/schema";

export default function ProjectGrid() {
  const { language } = useApp();
  const { state, addToList } = useCms();
  const projects = state.dashboard.projects;

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
          <Icon name="rocket_launch" size={28} color="var(--primary-bright)" />
          <span>{language === "fa" ? "کار برجسته" : "Featured Work"}</span>
        </h2>
        <Link
          href="/projects"
          className="text-sm font-semibold hover:underline flex items-center gap-1"
          style={{ color: "var(--primary-bright)" }}
        >
          <span>{language === "fa" ? "همه پروژه‌ها" : "All projects"}</span>
          <Icon name="arrow_forward" size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p, i) => (
          <ListItem key={p.id} path="dashboard.projects" index={i}>
            <ProjectCard project={p} index={i} />
          </ListItem>
        ))}
      </div>
      <div className="mt-4">
        <AddButton
          label={language === "fa" ? "افزودن کارت" : "Add feature card"}
          onClick={() =>
            addToList<DashboardProject>("dashboard.projects", {
              id: `dp-${Date.now()}`,
              title: { fa: "پروژه جدید", en: "New Project" },
              description: { fa: "توضیحات پروژه", en: "Project description" },
              tags: ["TAG"],
              icon: "dataset",
              category: { fa: "دسته", en: "Category" },
            })
          }
        />
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }: { project: DashboardProject; index: number }) {
  const { language } = useApp();
  return (
    <article
      className="glass glass-hover rounded-2xl p-6 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className="w-10 h-10 rounded-lg grid place-items-center"
          style={{
            background: "var(--chip-bg)",
            color: "var(--primary-bright)",
          }}
        >
          <Icon name={p.icon} size={20} />
        </div>
        <Editable
          path={`dashboard.projects.${index}.category`}
          raw={p.category}
          className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: "var(--outline)" }}
        />
      </div>
      <Editable
        path={`dashboard.projects.${index}.title`}
        raw={p.title}
        as="h3"
        className="text-xl font-extrabold mb-2"
        style={{ color: "var(--on-surface)" }}
      />
      <Editable
        path={`dashboard.projects.${index}.description`}
        raw={p.description}
        multiline
        as="p"
        className="text-sm mb-4 leading-relaxed line-clamp-3"
        style={{ color: "var(--on-surface-variant)" }}
      />
      <div
        className="mt-auto pt-4 flex justify-between items-center border-t"
        style={{ borderColor: "var(--outline-variant)" }}
      >
        <div className="flex gap-1.5 flex-wrap">
          {p.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-1 text-xs font-bold uppercase"
          style={{ color: "var(--primary-bright)" }}
        >
          {language === "fa" ? "مشاهده" : "View"}
          <Icon name="arrow_outward" size={14} />
        </Link>
      </div>
    </article>
  );
}

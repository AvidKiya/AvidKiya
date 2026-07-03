"use client";

import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import Editable from "@/components/cms/Editable";
import { AddButton, ListItem } from "@/components/cms/EditableList";
import type { DashboardProject } from "@/lib/cms/schema";
import Icon from "@/components/ui/Icon";

export default function ProjectGrid() {
  const { dir } = useApp();
  const { state, addToList } = useCms();
  const projects = state.dashboard.projects;

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <ListItem key={p.id} path="dashboard.projects" index={i}>
            <article
              className="glass-panel p-8 rounded-xl flex flex-col h-full"
              style={{ background: "var(--glass-bg)" }}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: "rgba(33,241,168,0.1)", color: "var(--primary)" }}
                >
                  <Icon name={p.icon} />
                </div>
                <Editable
                  path={`dashboard.projects.${i}.category`}
                  raw={p.category}
                  className="text-[10px] font-mono opacity-50 uppercase tracking-widest"
                  style={{ color: "var(--on-surface-variant)" }}
                />
              </div>
              <Editable
                path={`dashboard.projects.${i}.title`}
                raw={p.title}
                as="h3"
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--on-surface)" }}
              />
              <Editable
                path={`dashboard.projects.${i}.description`}
                raw={p.description}
                multiline
                as="p"
                className="text-sm mb-8 leading-relaxed opacity-70"
                style={{ color: "var(--on-surface-variant)" }}
              />
              <div
                className="mt-auto pt-6 flex justify-between items-center border-t"
                style={{ borderColor: "var(--outline-variant)" }}
              >
                <div className="flex gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded font-mono"
                      style={{
                        background: "var(--chip-bg)",
                        color: "var(--on-surface-variant)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="/projects"
                  className="flex items-center gap-1 text-xs font-bold uppercase"
                  style={{ color: "var(--primary)" }}
                >
                  View
                  <Icon name={dir === "rtl" ? "arrow_back" : "arrow_outward"} size={16} />
                </a>
              </div>
            </article>
          </ListItem>
        ))}
      </div>
      <div className="mt-4">
        <AddButton
          label="Add feature card"
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

"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, Input, Label, ListShell, Section, Textarea } from "../common";
import type { CustomRepoProject } from "@/lib/cms/schema";
import ImageUpload from "@/components/ui/ImageUpload";

export default function ProjectsEditor() {
  const { state, update, addToList } = useCms();

  return (
    <Section
      title="Custom Projects"
      desc="These appear alongside your live GitHub repos on the Projects page. Add anything that isn't on GitHub (private work, closed-source, etc.)."
    >
      <Card>
        <ListShell
          items={state.projects.customProjects}
          path="projects.customProjects"
          addLabel="Add custom project"
          gridCols={1}
          onAdd={() =>
            addToList<CustomRepoProject>("projects.customProjects", {
              id: `custom-${Date.now()}`,
              name: "new-project",
              description: "A short description",
              descriptionFa: "توضیح کوتاه",
              url: "https://",
              language: "TypeScript",
              topics: [],
              status: "STABLE",
              createdAt: new Date().toISOString(),
            })
          }
          render={(p, i) => (
            <div className="space-y-3">
              <ImageUpload
                label="Cover image"
                value={p.image}
                onChange={(v) => update(`projects.customProjects.${i}.image`, v)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Project name</Label>
                  <Input value={p.name} onChange={(e) => update(`projects.customProjects.${i}.name`, e.target.value)} />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input dir="ltr" value={p.url} onChange={(e) => update(`projects.customProjects.${i}.url`, e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Description (EN)</Label>
                  <Textarea rows={2} value={p.description} onChange={(e) => update(`projects.customProjects.${i}.description`, e.target.value)} />
                </div>
                <div>
                  <Label>Description (FA)</Label>
                  <Textarea rows={2} dir="rtl" value={p.descriptionFa ?? ""} onChange={(e) => update(`projects.customProjects.${i}.descriptionFa`, e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Language</Label>
                  <Input value={p.language ?? ""} onChange={(e) => update(`projects.customProjects.${i}.language`, e.target.value)} />
                </div>
                <div>
                  <Label>Topics (comma sep)</Label>
                  <Input
                    dir="ltr"
                    value={(p.topics ?? []).join(", ")}
                    onChange={(e) =>
                      update(
                        `projects.customProjects.${i}.topics`,
                        e.target.value.split(",").map((x) => x.trim()).filter(Boolean)
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={p.status}
                    onChange={(e) => update(`projects.customProjects.${i}.status`, e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--outline-variant)",
                      color: "var(--on-surface)",
                    }}
                  >
                    <option value="STABLE">STABLE</option>
                    <option value="BETA">BETA</option>
                    <option value="ALPHA">ALPHA</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        />
      </Card>
    </Section>
  );
}

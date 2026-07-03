"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, I18nRow, Input, Label, ListShell, Section, Textarea } from "../common";
import type {
  ResumeEducation,
  ResumeExperience,
  ResumeSkill,
} from "@/lib/cms/schema";

export default function ResumeEditor() {
  const { state, update, addToList } = useCms();
  const r = state.resume;

  return (
    <Section title="Resume" desc="Content shown on /resume and used when visitors print your CV.">
      <Card title="Summary & contact">
        <div className="space-y-3">
          <I18nRow
            label="Summary paragraph"
            value={r.summary}
            onChange={(v) => update("resume.summary", v)}
            multiline
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Phone</Label>
              <Input dir="ltr" value={r.phone ?? ""} onChange={(e) => update("resume.phone", e.target.value)} />
            </div>
            <div>
              <Label>Website</Label>
              <Input dir="ltr" value={r.website ?? ""} onChange={(e) => update("resume.website", e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      <Card title={`Experience (${r.experience.length})`}>
        <ListShell
          items={r.experience}
          path="resume.experience"
          gridCols={1}
          addLabel="Add role"
          onAdd={() =>
            addToList<ResumeExperience>("resume.experience", {
              id: `exp-${Date.now()}`,
              period: { fa: "دوره", en: "Period" },
              role: { fa: "نقش", en: "Role" },
              org: { fa: "شرکت", en: "Company" },
              bullets: [{ fa: "دستاورد", en: "Achievement" }],
            })
          }
          render={(e, i) => (
            <div className="space-y-3">
              <I18nRow label="Role" value={e.role} onChange={(v) => update(`resume.experience.${i}.role`, v)} />
              <I18nRow label="Organisation" value={e.org} onChange={(v) => update(`resume.experience.${i}.org`, v)} />
              <I18nRow label="Period" value={e.period} onChange={(v) => update(`resume.experience.${i}.period`, v)} />
              <div>
                <Label>Bullets</Label>
                <div className="space-y-2">
                  {e.bullets.map((b, bi) => (
                    <div key={bi} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                      <Input
                        dir="rtl"
                        value={b.fa}
                        onChange={(ev) => update(`resume.experience.${i}.bullets.${bi}.fa`, ev.target.value)}
                        placeholder="فارسی"
                      />
                      <div className="flex gap-2">
                        <Input
                          dir="ltr"
                          value={b.en}
                          onChange={(ev) => update(`resume.experience.${i}.bullets.${bi}.en`, ev.target.value)}
                          placeholder="English"
                        />
                        <button
                          onClick={() =>
                            update(
                              `resume.experience.${i}.bullets`,
                              e.bullets.filter((_, k) => k !== bi)
                            )
                          }
                          className="px-2 rounded"
                          style={{ background: "rgba(255,180,171,0.1)", color: "#ffb4ab" }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      update(`resume.experience.${i}.bullets`, [
                        ...e.bullets,
                        { fa: "", en: "" },
                      ])
                    }
                    className="text-xs px-3 py-1.5 rounded border border-dashed"
                    style={{ borderColor: "rgba(33,241,168,0.4)", color: "var(--primary)" }}
                  >
                    + Add bullet
                  </button>
                </div>
              </div>
            </div>
          )}
        />
      </Card>

      <Card title={`Skills (${r.skills.length})`}>
        <ListShell
          items={r.skills}
          path="resume.skills"
          gridCols={2}
          addLabel="Add skill"
          onAdd={() =>
            addToList<ResumeSkill>("resume.skills", {
              id: `sk-${Date.now()}`,
              name: "New skill",
              level: 50,
            })
          }
          render={(s, i) => (
            <div className="space-y-2">
              <div>
                <Label>Name</Label>
                <Input value={s.name} onChange={(e) => update(`resume.skills.${i}.name`, e.target.value)} />
              </div>
              <div>
                <Label>Level ({s.level}%)</Label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={s.level}
                  onChange={(e) => update(`resume.skills.${i}.level`, parseInt(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "var(--primary)" }}
                />
              </div>
            </div>
          )}
        />
      </Card>

      <Card title={`Education (${r.education.length})`}>
        <ListShell
          items={r.education}
          path="resume.education"
          gridCols={1}
          addLabel="Add education"
          onAdd={() =>
            addToList<ResumeEducation>("resume.education", {
              id: `edu-${Date.now()}`,
              period: { fa: "دوره", en: "Period" },
              degree: { fa: "مدرک", en: "Degree" },
              school: { fa: "دانشگاه", en: "School" },
            })
          }
          render={(e, i) => (
            <div className="space-y-3">
              <I18nRow label="Degree" value={e.degree} onChange={(v) => update(`resume.education.${i}.degree`, v)} />
              <I18nRow label="School" value={e.school} onChange={(v) => update(`resume.education.${i}.school`, v)} />
              <I18nRow label="Period" value={e.period} onChange={(v) => update(`resume.education.${i}.period`, v)} />
            </div>
          )}
        />
      </Card>

      <Card title={`Languages (${r.languages.length})`}>
        <ListShell
          items={r.languages}
          path="resume.languages"
          gridCols={2}
          addLabel="Add language"
          onAdd={() =>
            addToList("resume.languages", {
              id: `l-${Date.now()}`,
              name: { fa: "زبان", en: "Language" },
              level: { fa: "سطح", en: "Level" },
            })
          }
          render={(l, i) => (
            <div className="space-y-3">
              <I18nRow label="Name" value={l.name} onChange={(v) => update(`resume.languages.${i}.name`, v)} />
              <I18nRow label="Level" value={l.level} onChange={(v) => update(`resume.languages.${i}.level`, v)} />
            </div>
          )}
        />
      </Card>
    </Section>
  );
}

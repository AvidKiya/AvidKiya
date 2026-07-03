"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, I18nRow, Input, Label, Section } from "../common";
import ImageUpload from "@/components/ui/ImageUpload";

export default function IdentityEditor() {
  const { state, update } = useCms();
  const id = state.identity;

  return (
    <Section title="Identity" desc="Your personal information — shown on all pages.">
      <Card title="Personal Info">
        <div className="space-y-4">
          <I18nRow label="Full name" value={id.fullName} onChange={(v) => update("identity.fullName", v)} />
          <I18nRow label="Job title" value={id.title} onChange={(v) => update("identity.title", v)} />
          <I18nRow label="Location" value={id.location} onChange={(v) => update("identity.location", v)} />
          <I18nRow label="Bio" value={id.bio} onChange={(v) => update("identity.bio", v)} multiline />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Handle (@ username)</Label>
              <Input value={id.handle} onChange={(e) => update("identity.handle", e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input dir="ltr" value={id.email} onChange={(e) => update("identity.email", e.target.value)} />
            </div>
            <div>
              <Label>Years experience</Label>
              <Input
                type="number"
                value={id.yearsExperience}
                onChange={(e) => update("identity.yearsExperience", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Brand">
        <div className="mb-4">
          <ImageUpload
            label="Logo image (leave empty to use letter fallback)"
            value={state.brand.logoImage}
            onChange={(v) => update("brand.logoImage", v)}
            aspectRatio="1/1"
            maxSizeKB={200}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Logo letter (fallback)</Label>
            <Input
              value={state.brand.logoLetter}
              onChange={(e) => update("brand.logoLetter", e.target.value.slice(0, 2))}
              maxLength={2}
            />
          </div>
          <div>
            <Label>Primary color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={state.brand.primaryColor}
                onChange={(e) => update("brand.primaryColor", e.target.value)}
                className="h-10 w-16 rounded cursor-pointer"
                style={{ background: "transparent" }}
              />
              <Input
                value={state.brand.primaryColor}
                onChange={(e) => update("brand.primaryColor", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <I18nRow label="Brand name" value={state.brand.brandName} onChange={(v) => update("brand.brandName", v)} />
        </div>
      </Card>
    </Section>
  );
}

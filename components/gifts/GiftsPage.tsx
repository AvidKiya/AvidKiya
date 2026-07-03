"use client";

import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/Icon";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import Editable from "@/components/cms/Editable";
import { ListItem, AddButton } from "@/components/cms/EditableList";
import type { DonationLink, DownloadItem } from "@/lib/cms/schema";

export default function GiftsPage() {
  const { language, dir } = useApp();
  const { state, addToList, resolve } = useCms();
  const g = state.gifts;

  return (
    <>
      <TopNav />
      <main className="relative z-10 pt-24 pb-16 px-4 md:px-6 max-w-6xl mx-auto">
        {/* Hero */}
        <section className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{
              background: "rgba(33,241,168,0.1)",
              border: "1px solid rgba(33,241,168,0.25)",
              color: "var(--primary)",
            }}
          >
            <Icon name="rocket_launch" size={14} />
            <Editable path="gifts.title" raw={g.title} as="span" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--on-surface)" }}
          >
            {language === "fa" ? "تبادل هدیه" : "Gift Exchange"}
          </h1>
          <Editable
            path="gifts.subtitle"
            raw={g.subtitle}
            as="p"
            multiline
            className="max-w-2xl mx-auto opacity-70 leading-relaxed"
            style={{ color: "var(--on-surface-variant)" }}
          />
        </section>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MY GIFT TO YOU — downloads */}
          <section
            className="glass-panel rounded-xl p-6 md:p-8"
            style={{ background: "var(--surface-container-solid)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg grid place-items-center"
                style={{ background: "rgba(33,241,168,0.15)", color: "var(--primary)" }}
              >
                <Icon name="download" size={20} />
              </div>
              <Editable
                path="gifts.downloadTitle"
                raw={g.downloadTitle}
                as="h2"
                className="text-2xl font-bold"
                style={{ color: "var(--on-surface)" }}
              />
            </div>
            <Editable
              path="gifts.downloadSubtitle"
              raw={g.downloadSubtitle}
              as="p"
              multiline
              className="text-sm opacity-70 mb-6"
              style={{ color: "var(--on-surface-variant)" }}
            />

            <div className="space-y-3">
              {g.downloads.map((d, i) => (
                <ListItem key={d.id} path="gifts.downloads" index={i}>
                  <DownloadCard item={d} indexPath={i} />
                </ListItem>
              ))}
              <AddButton
                compact
                label="Add download"
                onClick={() =>
                  addToList<DownloadItem>("gifts.downloads", {
                    id: `dl-${Date.now()}`,
                    title: { fa: "فایل جدید", en: "New file" },
                    description: { fa: "توضیح فایل", en: "Description" },
                    href: "#",
                    fileType: "file",
                    size: "0KB",
                    free: true,
                  })
                }
              />
            </div>
          </section>

          {/* YOUR GIFT TO ME — donations */}
          <section
            className="glass-panel rounded-xl p-6 md:p-8"
            style={{ background: "var(--surface-container-solid)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg grid place-items-center"
                style={{ background: "rgba(255,180,171,0.15)", color: "#ffb4ab" }}
              >
                <Icon name="heart" size={20} />
              </div>
              <Editable
                path="gifts.donationTitle"
                raw={g.donationTitle}
                as="h2"
                className="text-2xl font-bold"
                style={{ color: "var(--on-surface)" }}
              />
            </div>
            <Editable
              path="gifts.donationSubtitle"
              raw={g.donationSubtitle}
              as="p"
              multiline
              className="text-sm opacity-70 mb-6"
              style={{ color: "var(--on-surface-variant)" }}
            />

            <div className="space-y-3">
              {g.donationLinks.map((d, i) => (
                <ListItem key={d.id} path="gifts.donationLinks" index={i}>
                  <DonationCard link={d} />
                </ListItem>
              ))}
              <AddButton
                compact
                label="Add donation link"
                onClick={() =>
                  addToList<DonationLink>("gifts.donationLinks", {
                    id: `dn-${Date.now()}`,
                    label: { fa: "روش جدید", en: "New method" },
                    href: "https://",
                    icon: "heart",
                    color: "#ff6b6b",
                  })
                }
              />
            </div>

            <div
              className="mt-6 pt-6 border-t text-center text-xs opacity-70"
              style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface-variant)" }}
            >
              {language === "fa"
                ? "❤️ هر حمایتی، هرچقدر کوچک، انگیزه‌ی من است."
                : "❤️ Every bit of support keeps me motivated."}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ─────────── cards ─────────── */

function DownloadCard({ item, indexPath }: { item: DownloadItem; indexPath: number }) {
  const { language } = useApp();
  const { resolve } = useCms();
  return (
    <div
      className="p-4 rounded-lg border flex items-start gap-3 group transition-all hover:border-opacity-60"
      style={{
        background: "rgba(0,0,0,0.2)",
        borderColor: "var(--outline-variant)",
      }}
    >
      <div
        className="w-10 h-10 rounded-md grid place-items-center shrink-0"
        style={{
          background: "var(--surface-container-highest)",
          color: "var(--primary)",
        }}
      >
        <Icon
          name={
            item.fileType === "pdf"
              ? "description"
              : item.fileType === "config"
              ? "code"
              : item.fileType === "zip"
              ? "folder"
              : "download"
          }
          size={18}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Editable
            path={`gifts.downloads.${indexPath}.title`}
            raw={item.title}
            as="span"
            className="font-bold text-sm"
            style={{ color: "var(--on-surface)" }}
          />
          {item.free && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold"
              style={{ background: "rgba(33,241,168,0.15)", color: "var(--primary)" }}
            >
              {language === "fa" ? "رایگان" : "FREE"}
            </span>
          )}
          {item.category && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: "var(--surface-container-highest)", color: "var(--on-surface-variant)" }}
            >
              {resolve(item.category)}
            </span>
          )}
        </div>
        <Editable
          path={`gifts.downloads.${indexPath}.description`}
          raw={item.description}
          as="p"
          multiline
          className="text-xs opacity-70 mb-2"
          style={{ color: "var(--on-surface-variant)" }}
        />
        <div className="flex items-center gap-3 text-[11px] font-mono opacity-70" style={{ color: "var(--on-surface-variant)" }}>
          {item.fileType && <span>{item.fileType.toUpperCase()}</span>}
          {item.size && <span>{item.size}</span>}
        </div>
      </div>
      <a
        href={item.href}
        target={item.href.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        download
        className="shrink-0 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-transform hover:scale-105"
        style={{ background: "var(--primary)", color: "var(--on-primary)" }}
      >
        <Icon name="download" size={14} />
        {language === "fa" ? "دانلود" : "Get"}
      </a>
    </div>
  );
}

function DonationCard({ link }: { link: DonationLink }) {
  const { resolve } = useCms();
  return (
    <a
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="flex items-center gap-3 p-4 rounded-lg border transition-all hover:-translate-y-0.5"
      style={{
        background: "rgba(0,0,0,0.2)",
        borderColor: "var(--outline-variant)",
        color: "var(--on-surface)",
      }}
    >
      <div
        className="w-10 h-10 rounded-md grid place-items-center shrink-0"
        style={{ background: link.color ?? "var(--primary)", color: "#fff" }}
      >
        <Icon name={link.icon} size={18} />
      </div>
      <div className="flex-1 font-bold text-sm">{resolve(link.label)}</div>
      <Icon name="arrow_outward" size={16} color="var(--on-surface-variant)" />
    </a>
  );
}

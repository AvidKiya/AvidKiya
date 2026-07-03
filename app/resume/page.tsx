"use client";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";

export default function ResumePage(){
  const { cms, resolve } = useCms();
  const { lang } = useApp();

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center mb-4 no-print">
        <h1 className="text-xl font-black">{lang==="fa" ? "رزومه" : "Resume"}</h1>
        <button onClick={()=>window.print()} className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">🖨 {lang==="fa" ? "چاپ" : "Print"}</button>
      </div>
      <div className="glass rounded-2xl p-8 md:p-10 bg-white text-black print:shadow-none print:border-0" id="resume-print" style={{ color: "#111" }}>
        <header className="border-b pb-5 mb-6" style={{ borderColor: "#ddd" }}>
          <h1 className="text-3xl font-black" style={{ color: "#0b1a17" }}>{resolve(cms.identity.fullName)}</h1>
          <div className="text-lg" style={{ color: "#004741" }}>{resolve(cms.identity.title)}</div>
          <div className="text-sm mt-2" style={{ color: "#444" }}>
            {cms.identity.email} • {cms.resume.phone} • {cms.resume.website}
          </div>
        </header>

        <section className="mb-6">
          <h2 className="font-black text-[17px] mb-2" style={{ color: "#004741" }}>Summary</h2>
          <p className="text-[14px] leading-relaxed">{resolve(cms.resume.summary)}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-black text-[17px] mb-3" style={{ color: "#004741" }}>Experience</h2>
          <div className="space-y-4">
            {cms.resume.experience.map(exp=>(
              <div key={exp.id}>
                <div className="flex justify-between font-bold">
                  <span>{resolve(exp.role)} — {resolve(exp.company)}</span>
                  <span className="text-sm text-gray-600">{resolve(exp.period)}</span>
                </div>
                <ul className="list-disc ps-5 text-[13px] mt-1 space-y-1">
                  {exp.bullets.map((b,i)=><li key={i}>{resolve(b)}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-black text-[17px] mb-3" style={{ color: "#004741" }}>Skills</h2>
            <div className="space-y-2">
              {cms.resume.skills.map(s=>(
                <div key={s.id}>
                  <div className="flex justify-between text-[13px]"><span>{s.name}</span><span>{s.percent}%</span></div>
                  <div className="h-[6px] bg-gray-200 rounded"><div className="h-[6px] rounded bg-[#004741]" style={{ width: s.percent+"%" }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-black text-[17px] mb-3" style={{ color: "#004741" }}>Education</h2>
            {cms.resume.education.map(ed=>(
              <div key={ed.id} className="text-[13px] mb-2">
                <div className="font-bold">{resolve(ed.degree)}</div>
                <div>{resolve(ed.school)} • {resolve(ed.period)}</div>
              </div>
            ))}
            <h2 className="font-black text-[17px] mt-4 mb-2" style={{ color: "#004741" }}>Languages</h2>
            <div className="text-[13px]">
              {cms.resume.languages.map(l=> <div key={l.id}>{resolve(l.name)} — {resolve(l.level)}</div>)}
            </div>
          </div>
        </section>
      </div>
      <style jsx global>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; max-width: 100% !important; }
          #resume-print { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
        }
        @page { size: A4; margin: 14mm; }
      `}</style>
    </div>
  );
}

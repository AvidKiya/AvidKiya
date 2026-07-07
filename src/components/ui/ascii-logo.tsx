'use client';
export function AsciiLogo({ small=false }: { small?: boolean }) {
  return (
    <pre className={`ascii-art select-none ${small ? 'text-[10px] sm:text-[11px] leading-tight' : ''}`} dir="ltr" style={{direction:'ltr', textAlign:'left', unicodeBidi:'isolate'}}>
{`▄▀█ █░█ █ █▀▄ █▄▀ █ █▄█ ▄▀█
█▀█ ▀▄▀ █ █▄▀ █░█ █ ░█░ █▀█
░░░ A V I D D E V H U B ░░░`}
    </pre>
  );
}

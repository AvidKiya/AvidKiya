export type VectorItem = {
  id: string;
  sourceId: string;
  sourceType: 'note' | 'task' | 'goal' | 'capture';
  title: string;
  text: string;
  vector: number[];
  createdAt: string;
};

const DIM = 256;

function tokenize(text: string) {
  return text.toLowerCase().normalize('NFKC').split(/[^\p{L}\p{N}]+/u).filter(t => t.length > 1).slice(0, 500);
}

function hashToken(token: string) {
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function embedText(text: string) {
  const v = new Array(DIM).fill(0);
  for (const token of tokenize(text)) {
    const h = hashToken(token);
    const idx = h % DIM;
    const sign = (h & 1) ? 1 : -1;
    v[idx] += sign;
  }
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map(x => Math.round((x / norm) * 1_000_000) / 1_000_000);
}

export function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / ((Math.sqrt(na) || 1) * (Math.sqrt(nb) || 1));
}

export function vectorId(type: string, id: string) {
  return `${type}:${id}`;
}

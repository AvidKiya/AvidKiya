// Minimal ambient declarations for Cloudflare bindings used across the app.
// We avoid pulling in the full @cloudflare/workers-types global override
// (which redefines DOM types like Request/Response) to keep Next.js's
// standard Node/Edge runtime types intact.

declare global {
  interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    meta: Record<string, unknown>;
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run<T = unknown>(): Promise<D1Result<T>>;
    all<T = unknown>(): Promise<D1Result<T>>;
    raw<T = unknown>(): Promise<T[]>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1Result>;
  }

  interface KVNamespaceGetOptions {
    type?: 'text' | 'json' | 'arrayBuffer' | 'stream';
  }

  interface KVNamespacePutOptions {
    expiration?: number;
    expirationTtl?: number;
    metadata?: Record<string, unknown>;
  }

  interface KVNamespace {
    get(key: string, options?: KVNamespaceGetOptions | string): Promise<any>;
    put(key: string, value: string | ArrayBuffer | ReadableStream, options?: KVNamespacePutOptions): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
      keys: { name: string; expiration?: number; metadata?: unknown }[];
      list_complete: boolean;
      cursor?: string;
    }>;
  }

  interface R2Object {
    key: string;
    size: number;
    etag: string;
    uploaded: Date;
  }

  interface R2Bucket {
    get(key: string): Promise<(R2Object & { body: ReadableStream; text(): Promise<string>; arrayBuffer(): Promise<ArrayBuffer> }) | null>;
    put(key: string, value: ReadableStream | ArrayBuffer | string): Promise<R2Object>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string }): Promise<{ objects: R2Object[] }>;
  }
}

export {};

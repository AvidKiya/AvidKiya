import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextCoreWebVitals,
  {
    rules: {
      // This app intentionally uses client-side localStorage hydration and pragmatic
      // effect loading in many admin/planner screens. Build/typecheck remain strict.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", ".vercel/**", "out/**", "build/**", "next-env.d.ts"]),
]);

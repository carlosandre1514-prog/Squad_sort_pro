import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  basePath: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**/*", "dist/**/*", "node_modules/**/*"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;

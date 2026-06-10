import globals from "globals"
import js from "@eslint/js"

export default [
  js.configs.recommended,
  {
    ignores: [".next/", "node_modules/", "dist/", "build/", "*.log", "dev.db"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
]

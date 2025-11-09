// eslint.config.mjs
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
    // ---------- התעלמות מתיקיות בנייה ותלויות ----------
    {
        ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.next/**", "**/coverage/**"]
    },

    // ---------- קונפיג בסיסי של JavaScript ----------
    js.configs.recommended,

    // ============================================================
    // FRONTEND – קוד אפליקציית React
    // ============================================================
    {
        files: ["frontend/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
        ignores: [
            "frontend/**/vite.config.{js,cjs,mjs}",
            "frontend/**/postcss.config.{js,cjs,mjs}",
            "frontend/**/tailwind.config.{js,cjs,mjs}"
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module", // מאפשר import/export
            globals: { ...globals.browser },
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        settings: { react: { version: "detect" } },
        plugins: { react, prettier },
        rules: {
            ...react.configs.flat.recommended.rules,
            "react/react-in-jsx-scope": "off", // ל-React 17+
            "prettier/prettier": ["error", { singleQuote: true }]
        }
    },

    // ============================================================
    // FRONTEND TESTS – קבצי Jest (למנוע no-undef)
    // ============================================================
    {
        files: ["frontend/**/*.{test,spec}.{js,jsx,ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.browser, ...globals.jest }
        },
        plugins: { prettier },
        rules: { "prettier/prettier": ["error", { singleQuote: true }] }
    },

    // ============================================================
    // BACKEND – קוד Node.js (Express)
    // ============================================================
    {
        files: ["backend/**/*.{js,mjs,cjs}"],
        languageOptions: {
            ecmaVersion: "latest",
            // אם אתה משתמש ב-require/module.exports → שנה ל-"script"
            sourceType: "module",
            globals: { ...globals.node }
        },
        plugins: { prettier },
        rules: {
            "prettier/prettier": ["error", { singleQuote: true }],
            // מתעלם מפרמטרים לא בשימוש שמתחילים בקו תחתון (_next)
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
        }
    },

    // ============================================================
    // BACKEND TESTS – Jest
    // ============================================================
    {
        files: ["backend/tests/**/*.{js,mjs,cjs}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.node, ...globals.jest }
        },
        plugins: { prettier },
        rules: { "prettier/prettier": ["error", { singleQuote: true }] }
    },

    // ============================================================
    // CONFIG FILES – Vite, PostCSS, Tailwind
    // ============================================================
    // קונפיגים ב-ESM (Vite/PostCSS)
    {
        files: [
            "frontend/**/vite.config.{js,mjs}",
            "frontend/**/postcss.config.{js,mjs}"
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.node }
        },
        plugins: { prettier },
        rules: {
            "prettier/prettier": ["error", { singleQuote: true }],
            "no-undef": "off"
        }
    },

    // קונפיגים ב-CommonJS (Tailwind)
    {
        files: ["frontend/**/tailwind.config.{js,cjs,mjs}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script", // קונפיגים עם require/module.exports
            globals: { ...globals.node }
        },
        plugins: { prettier },
        rules: {
            "prettier/prettier": ["error", { singleQuote: true }],
            "no-undef": "off"
        }
    }
]);

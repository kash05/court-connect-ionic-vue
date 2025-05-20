/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
  VITE_API_VERSION: string;
  VITE_CLIENT_ID: string;
  VITE_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

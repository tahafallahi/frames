/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TV_SHOW_PLACEHOLDER: string;
  readonly VITE_MOVIE_PLACEHOLDER: string;
  readonly VITE_PROFILE_PLACEHOLDER: string;
  readonly VITE_TOASTER_TIMEOUT: string;
  readonly VITE_GOOGLE_OAUTH2_LINK: string;
  readonly VITE_SUPABASE_PROJECT_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
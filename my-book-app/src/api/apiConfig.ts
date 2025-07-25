const BASE_URL =
  (window as any)._env_?.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL; // fallback for development

export default BASE_URL;

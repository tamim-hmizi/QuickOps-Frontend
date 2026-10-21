// Service URLs come from the build environment so one build can target any deployment.
const trimSlash = (url) => url.replace(/\/+$/, "");

export const API_URL = trimSlash(import.meta.env.VITE_API_URL || "http://localhost:5000/api");
export const AI_URL = trimSlash(import.meta.env.VITE_AI_URL || "http://localhost:8001");

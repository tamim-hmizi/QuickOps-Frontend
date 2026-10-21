// The API URL comes from the build environment so one build can target any deployment.
const trimSlash = (url) => url.replace(/\/+$/, "");

export const API_URL = trimSlash(import.meta.env.VITE_API_URL || "http://localhost:5000/api");

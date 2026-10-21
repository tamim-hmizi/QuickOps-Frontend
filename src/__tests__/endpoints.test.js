import { afterEach, describe, expect, it, vi } from "vitest";

const load = async () => {
  vi.resetModules();
  return import("../config/endpoints");
};

describe("service endpoints", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("defaults to local services", async () => {
    vi.stubEnv("VITE_API_URL", "");
    vi.stubEnv("VITE_AI_URL", "");
    const { API_URL, AI_URL } = await load();
    expect(API_URL).toBe("http://localhost:5000/api");
    expect(AI_URL).toBe("http://localhost:8001");
  });

  it("uses the build environment and drops trailing slashes", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com/api/");
    vi.stubEnv("VITE_AI_URL", "https://ai.example.com//");
    const { API_URL, AI_URL } = await load();
    expect(API_URL).toBe("https://api.example.com/api");
    expect(AI_URL).toBe("https://ai.example.com");
  });
});

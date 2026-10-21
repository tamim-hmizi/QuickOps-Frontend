import { afterEach, describe, expect, it, vi } from "vitest";

const load = async () => {
  vi.resetModules();
  return import("../config/endpoints");
};

describe("API endpoint", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("defaults to the local backend", async () => {
    vi.stubEnv("VITE_API_URL", "");
    expect((await load()).API_URL).toBe("http://localhost:5000/api");
  });

  it("uses the build environment and drops trailing slashes", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com/api/");
    expect((await load()).API_URL).toBe("https://api.example.com/api");
  });
});

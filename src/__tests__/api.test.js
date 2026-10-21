import { beforeEach, describe, expect, it } from "vitest";
import api from "../services/api";
import { store } from "../store";
import { login, logout } from "../slices/authSlice";

// Answer every request locally and record the headers that were sent.
let sentHeaders;
const respondWith = (status) => {
  api.defaults.adapter = async (config) => {
    sentHeaders = config.headers;
    if (status >= 400) {
      const error = new Error(`HTTP ${status}`);
      error.response = { status, data: {}, config };
      throw error;
    }
    return { status, data: {}, headers: {}, config, statusText: "OK" };
  };
};

describe("API client", () => {
  beforeEach(() => {
    store.dispatch(logout());
    sentHeaders = undefined;
  });

  it("sends no Authorization header when signed out", async () => {
    respondWith(200);
    await api.get("/projects");
    expect(sentHeaders.Authorization).toBeUndefined();
  });

  it("sends the session token as a Bearer header", async () => {
    store.dispatch(login({ _id: "1", email: "ops@example.com", token: "abc.def.ghi" }));
    respondWith(200);
    await api.get("/projects");
    expect(sentHeaders.Authorization).toBe("Bearer abc.def.ghi");
  });

  it("logs out when the API rejects the token", async () => {
    store.dispatch(login({ _id: "1", email: "ops@example.com", token: "expired" }));
    respondWith(401);
    await expect(api.get("/projects")).rejects.toThrow();
    expect(store.getState().auth.user).toBeNull();
  });

  it("keeps the session on other errors", async () => {
    store.dispatch(login({ _id: "1", email: "ops@example.com", token: "valid" }));
    respondWith(500);
    await expect(api.get("/projects")).rejects.toThrow();
    expect(store.getState().auth.user).not.toBeNull();
  });
});

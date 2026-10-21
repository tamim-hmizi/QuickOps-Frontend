import { describe, expect, it } from "vitest";
import reducer, { login, logout } from "../slices/authSlice";

describe("auth reducer", () => {
  it("starts signed out", () => {
    expect(reducer(undefined, { type: "@@init" })).toEqual({ user: null });
  });

  it("stores the user on login and clears it on logout", () => {
    const user = { _id: "1", email: "ops@example.com", active: true };
    const signedIn = reducer(undefined, login(user));
    expect(signedIn.user).toEqual(user);
    expect(reducer(signedIn, logout()).user).toBeNull();
  });
});

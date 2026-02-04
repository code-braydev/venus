import { describe, it, expect } from "vitest";
import { send } from "../src/index";

describe("Venus SEND Method", () => {
  it("should block empty body requests before sending", async () => {
    const { ok, status, error } = await send("/posts", {});
    expect(ok).toBe(false);
    expect(status).toBe(400);
    expect(error).toContain("empty body");
  });

  it("should create a resource successfully", async () => {
    const payload = { title: "Test Venus", body: "Content", userId: 1 };
    const { ok, data } = await send<any>(
      "https://jsonplaceholder.typicode.com/posts",
      payload,
    );
    expect(ok).toBe(true);
    expect(data.title).toBe(payload.title);
  });
});

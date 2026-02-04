import { describe, it, expect, beforeAll } from "vitest";
import { update, updateOnly, venusConfig } from "../src/index";

describe("Venus Update Methods", () => {
  beforeAll(() => {
    venusConfig.setBaseURL("https://jsonplaceholder.typicode.com");
  });

  it("should perform a full update (PUT)", async () => {
    const payload = {
      id: 1,
      title: "Updated Title",
      body: "New Body",
      userId: 1,
    };
    const { ok, data } = await update<any>("/posts/1", payload);

    expect(ok).toBe(true);
    expect(data.title).toBe("Updated Title");
  });

  it("should perform a partial update (PATCH) using updateOnly", async () => {
    const payload = { title: "Partial Update" };
    const { ok, data } = await updateOnly<any>("/posts/1", payload);

    expect(ok).toBe(true);
    expect(data.title).toBe("Partial Update");
  });

  it("should fail if body is empty", async () => {
    const { ok, status, error } = await update("/posts/1", {});

    expect(ok).toBe(false);
    expect(status).toBe(400);
    expect(error).toContain("requires a non-empty body");
  });
});
